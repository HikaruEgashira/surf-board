import { useState, useCallback, useRef, useEffect } from 'react';
import type { CodeSearchResult, SearchResponse } from '../types';
import { useGitHubToken } from '../context/GitHubTokenContext';
import { useSearchSettings } from '../context/SearchSettingsContext';

// API制限と設定
const API_CONSTANTS = {
  PER_PAGE: 30,
  MAX_ITEMS: 1000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  MAX_STORED_RESULTS: 300,
} as const;

// ファイル拡張子の設定
const FILE_EXTENSIONS = {
  NON_PROGRAMMING: new Set([
    'md', 'markdown', 'txt', 'doc', 'docx',
    'pdf', 'csv', 'json', 'xml', 'yaml', 'yml',
    'html', 'htm', 'css', 'scss', 'sass',
    'png', 'jpg', 'jpeg', 'gif', 'svg',
    'mp3', 'mp4', 'wav', 'avi',
    'zip', 'tar', 'gz', 'rar',
  ])
} as const;

// ユーティリティ関数
const utils = {
  isProgrammingFile: (path: string): boolean => {
    const filename = path.split('/').pop() || '';
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension) return false;
    return !FILE_EXTENSIONS.NON_PROGRAMMING.has(extension);
  },
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  createGitHubHeaders: (token: string) => ({
    Accept: 'application/vnd.github.v3.text-match+json',
    Authorization: `Bearer ${token}`,
  }),
  handleRateLimitError: (headers: Headers): never => {
    const resetTime = headers.get('x-ratelimit-reset');
    const waitTime = resetTime ? parseInt(resetTime) * 1000 - Date.now() : 0;
    throw new Error(`API rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
  }
};

export function useCodeSearch() {
  const { token } = useGitHubToken();
  const { excludeNonProgramming } = useSearchSettings();
  const [results, setResults] = useState<CodeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);
  const filteredCountRef = useRef<number>(0);

  const handleSearchReset = () => {
    setResults([]);
    setHasMore(false);
    setCurrentQuery('');
    setTotalResults(0);
    filteredCountRef.current = 0;
  };

  const handleSearchResponse = useCallback(async (
    response: Response,
    query: string,
    page: number,
    currentRequestId: number
  ) => {
    if (currentRequestId !== requestIdRef.current) return;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
        utils.handleRateLimitError(response.headers);
      }

      throw new Error(
        errorData.message ||
        `Failed to fetch code results: ${response.status} ${response.statusText}`
      );
    }

    const data: SearchResponse = await response.json();
    const totalPages = Math.ceil(data.total_count / API_CONSTANTS.PER_PAGE);

    if (page === 1) {
      setTotalResults(data.total_count);
    }

    setResults(prev => {
      let newResults = page === 1 ? data.items : [...prev, ...data.items];

      if (excludeNonProgramming) {
        const filteredResults = newResults.filter(item => utils.isProgrammingFile(item.path));
        const newFilteredCount = filteredResults.length;
        const removedCount = newResults.length - newFilteredCount;
        filteredCountRef.current += removedCount;
        newResults = filteredResults;
      }

      if (newResults.length > API_CONSTANTS.MAX_STORED_RESULTS) {
        newResults = newResults.slice(-API_CONSTANTS.MAX_STORED_RESULTS);
      }

      const remainingResults = totalResults - (page * API_CONSTANTS.PER_PAGE);
      const remainingFilteredResults = remainingResults - filteredCountRef.current;

      if (excludeNonProgramming && newResults.length === prev.length && page < totalPages) {
        searchCode(query, page + 1);
      }

      setHasMore(remainingFilteredResults > 0 && page < totalPages);

      return newResults;
    });

    setCurrentPage(page);
  }, [excludeNonProgramming, totalResults]);

  const searchCode = useCallback(async (query: string, page = 1, retryCount = 0) => {
    if (!token) {
      setError('GitHub token is required. Please set it in the settings.');
      return;
    }

    if (query === '') {
      handleSearchReset();
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const currentRequestId = ++requestIdRef.current;

    try {
      setIsLoading(true);
      setError(null);

      if (page === 1) {
        setResults([]);
        setCurrentQuery(query);
        filteredCountRef.current = 0;
      }

      const url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}&per_page=${API_CONSTANTS.PER_PAGE}&page=${page}`;
      const response = await fetch(url, {
        headers: utils.createGitHubHeaders(token),
        signal: abortControllerRef.current.signal
      });

      await handleSearchResponse(response, query, page, currentRequestId);

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      if (retryCount < API_CONSTANTS.MAX_RETRIES && err instanceof Error &&
        (err.message.includes('network') || err.message.includes('timeout'))) {
        await utils.delay(API_CONSTANTS.RETRY_DELAY * Math.pow(2, retryCount));
        return searchCode(query, page, retryCount + 1);
      }

      setError(err instanceof Error ? err.message : 'An error occurred');
      setHasMore(false);
    }
  }, [token, handleSearchResponse]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && currentQuery) {
      searchCode(currentQuery, currentPage + 1);
    }
  }, [isLoading, hasMore, currentQuery, currentPage, searchCode]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const currentRequestId = requestIdRef.current;
    if (currentRequestId === requestIdRef.current) {
      setIsLoading(results.length === 0 && currentQuery !== '');
    }
  }, [results, currentQuery]);

  return {
    results,
    isLoading,
    error,
    hasMore,
    searchCode,
    loadMore,
    totalResults,
  };
}
