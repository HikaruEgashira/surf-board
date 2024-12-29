import { useState, useCallback, useRef, useEffect } from 'react';
import type { CodeSearchResult, SearchResponse } from '../types';
import { useGitHubToken } from '../context/GitHubTokenContext';
import { useSearchSettings } from '../context/SearchSettingsContext';

const PER_PAGE = 30;
const MAX_ITEMS = 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const MAX_STORED_RESULTS = 300;

const NON_PROGRAMMING_EXTENSIONS = new Set([
  'md', 'markdown', 'txt', 'doc', 'docx',
  'pdf', 'csv', 'json', 'xml', 'yaml', 'yml',
  'html', 'htm', 'css', 'scss', 'sass',
  'png', 'jpg', 'jpeg', 'gif', 'svg',
  'mp3', 'mp4', 'wav', 'avi',
  'zip', 'tar', 'gz', 'rar',
]);

const isProgrammingFile = (path: string): boolean => {
  const filename = path.split('/').pop() || '';
  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return false;
  return !NON_PROGRAMMING_EXTENSIONS.has(extension);
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

  const searchCode = useCallback(async (query: string, page = 1, retryCount = 0) => {
    if (!token) {
      setError('GitHub token is required. Please set it in the settings.');
      return;
    }

    if (query === '') {
      setResults([]);
      setHasMore(false);
      setCurrentQuery('');
      setTotalResults(0);
      filteredCountRef.current = 0;
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

      const url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${page}`;

      const headers = {
        Accept: 'application/vnd.github.v3.text-match+json',
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, {
        headers,
        signal: abortControllerRef.current.signal
      });

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
          const resetTime = response.headers.get('x-ratelimit-reset');
          const waitTime = resetTime ? parseInt(resetTime) * 1000 - Date.now() : 0;
          throw new Error(`API rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
        }

        throw new Error(
          errorData.message ||
          `Failed to fetch code results: ${response.status} ${response.statusText}`
        );
      }

      const data: SearchResponse = await response.json();
      const totalPages = Math.ceil(Math.min(data.total_count, MAX_ITEMS) / PER_PAGE);

      if (page === 1) {
        setTotalResults(Math.min(data.total_count, MAX_ITEMS));
      }

      setResults(prev => {
        let newResults = page === 1 ? data.items : [...prev, ...data.items];

        if (excludeNonProgramming) {
          const filteredResults = newResults.filter(item => isProgrammingFile(item.path));
          const newFilteredCount = filteredResults.length;

          // フィルタリングで除外された件数を追跡
          const removedCount = newResults.length - newFilteredCount;
          filteredCountRef.current += removedCount;

          newResults = filteredResults;
        }

        // メモリ管理のための結果制限
        if (newResults.length > MAX_STORED_RESULTS) {
          newResults = newResults.slice(-MAX_STORED_RESULTS);
        }

        // まだ取得できる結果があるかどうかを判定
        const remainingResults = totalResults - (page * PER_PAGE);
        const remainingFilteredResults = remainingResults - filteredCountRef.current;

        // フィルタリングで全て除外された場合は次のページを自動的に取得
        if (excludeNonProgramming && newResults.length === prev.length && page < totalPages) {
          console.log('All results filtered out, automatically fetching next page');
          searchCode(query, page + 1);
        }

        setHasMore(remainingFilteredResults > 0 && page < totalPages);

        return newResults;
      });

      setCurrentPage(page);

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      console.error('Search error:', err);

      if (retryCount < MAX_RETRIES && err instanceof Error &&
        (err.message.includes('network') || err.message.includes('timeout'))) {
        await delay(RETRY_DELAY * Math.pow(2, retryCount));
        return searchCode(query, page, retryCount + 1);
      }

      setError(err instanceof Error ? err.message : 'An error occurred');
      setHasMore(false);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [token, excludeNonProgramming]);

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
