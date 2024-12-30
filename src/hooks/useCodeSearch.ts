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
const NON_PROGRAMMING_EXTENSIONS = new Set([
  'md', 'markdown', 'csv', 'json', 'xml', 'yaml', 'yml', 'html', 'htm'
])

// ユーティリティ関数
const utils = {
  isProgrammingFile: (path: string): boolean => {
    const filename = path.split('/').pop() || '';
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension) return false;
    return !NON_PROGRAMMING_EXTENSIONS.has(extension);
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

interface UseCodeSearchOptions {
  debounceDelay?: number;
  minQueryLength?: number;
}

// キャッシュの型定義
interface CacheEntry {
  results: CodeSearchResult[];
  totalResults: number;
  timestamp: number;
}

const searchCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5分

export function useCodeSearch({
  debounceDelay = 300,
  minQueryLength = 3
}: UseCodeSearchOptions = {}) {
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
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSearchRef = useRef<string>('');

  // キャッシュチェック関数
  const checkCache = useCallback((query: string): CacheEntry | null => {
    const cached = searchCache.get(query);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      searchCache.delete(query);
      return null;
    }
    return cached;
  }, []);

  const handleSearchReset = useCallback(() => {
    setResults([]);
    setHasMore(false);
    setCurrentQuery('');
    setTotalResults(0);
    filteredCountRef.current = 0;
    lastSearchRef.current = '';
  }, []);

  const handleSearchResponse = useCallback(async (
    response: Response,
    query: string,
    page: number,
    currentRequestId: number
  ): Promise<SearchResponse | null> => {
    if (currentRequestId !== requestIdRef.current) {
      return null;
    }

    try {
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

      if (currentRequestId !== requestIdRef.current) {
        return null;
      }

      if (page === 1) {
        setTotalResults(data.total_count);
      }

      const processResults = (prev: CodeSearchResult[]) => {
        if (currentRequestId !== requestIdRef.current) {
          return prev;
        }

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

        return newResults;
      };

      const newResults = processResults(results);
      setResults(newResults);

      // 実際の残りの結果数を計算
      const effectiveTotalCount = excludeNonProgramming
        ? Math.floor(data.total_count * (newResults.length / (page * API_CONSTANTS.PER_PAGE)))
        : data.total_count;

      const effectiveTotalPages = Math.ceil(effectiveTotalCount / API_CONSTANTS.PER_PAGE);
      const effectiveRemaining = effectiveTotalCount - (page * API_CONSTANTS.PER_PAGE);

      const shouldContinue = effectiveRemaining > 0
        && page < effectiveTotalPages
        && newResults.length < API_CONSTANTS.MAX_ITEMS;

      setHasMore(shouldContinue);

      // フィルタリングされた結果が少ない場合、自動的に次のページを読み込む
      if (excludeNonProgramming && shouldContinue && newResults.length < API_CONSTANTS.PER_PAGE * page / 2) {
        queueMicrotask(() => {
          if (currentRequestId === requestIdRef.current) {
            executeSearch(query, page + 1);
          }
        });
      }

      setCurrentPage(page);
      return data;
    } catch (error) {
      if (currentRequestId === requestIdRef.current) {
        throw error;
      }
      return null;
    }
  }, [excludeNonProgramming, results]);

  const executeSearch = useCallback(async (query: string, page = 1, retryCount = 0) => {
    if (!token) {
      setError('GitHub token is required. Please set it in the settings.');
      return;
    }

    // ページ1の場合、キャッシュをチェック
    if (page === 1) {
      const cached = checkCache(query);
      if (cached) {
        setResults(cached.results);
        setTotalResults(cached.totalResults);
        setCurrentQuery(query);
        setHasMore(cached.results.length < cached.totalResults);
        return;
      }
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

      const url = new URL('https://api.github.com/search/code');
      url.searchParams.set('q', query);
      url.searchParams.set('per_page', API_CONSTANTS.PER_PAGE.toString());
      url.searchParams.set('page', page.toString());

      const response = await fetch(url.toString(), {
        headers: utils.createGitHubHeaders(token),
        signal: abortControllerRef.current.signal
      });

      const data = await handleSearchResponse(response, query, page, currentRequestId);

      // 結果をキャッシュに保存（ページ1の場合のみ）
      if (page === 1 && data) {
        searchCache.set(query, {
          results: data.items,
          totalResults: data.total_count,
          timestamp: Date.now()
        });
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      if (retryCount < API_CONSTANTS.MAX_RETRIES && err instanceof Error &&
        (err.message.includes('network') || err.message.includes('timeout'))) {
        await utils.delay(API_CONSTANTS.RETRY_DELAY * Math.pow(2, retryCount));
        return executeSearch(query, page, retryCount + 1);
      }

      setError(err instanceof Error ? err.message : 'An error occurred');
      setHasMore(false);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [token, handleSearchResponse, checkCache]);

  const searchCode = useCallback((query: string) => {
    const trimmedQuery = query.trim();

    // 前回のタイマーをクリア
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = undefined;
    }

    // 空の入力値の場合はリセット
    if (trimmedQuery === '') {
      handleSearchReset();
      return;
    }

    // 最小文字数チェック
    if (trimmedQuery.length < minQueryLength) {
      return;
    }

    // 前回と同じクエリの場合はスキップ
    if (trimmedQuery === lastSearchRef.current) {
      return;
    }

    // デバウンスタイマーをセット
    debounceTimerRef.current = setTimeout(() => {
      lastSearchRef.current = trimmedQuery;
      executeSearch(trimmedQuery);
    }, debounceDelay);
  }, [debounceDelay, minQueryLength, handleSearchReset, executeSearch]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && currentQuery) {
      executeSearch(currentQuery, currentPage + 1);
    }
  }, [isLoading, hasMore, currentQuery, currentPage, executeSearch]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const isLastPage = useCallback(() => {
    return !hasMore && results.length > 0 && currentQuery !== '';
  }, [hasMore, results.length, currentQuery]);

  return {
    results,
    isLoading,
    error,
    hasMore,
    searchCode,
    loadMore,
    totalResults,
    isLastPage: isLastPage(),
  };
}
