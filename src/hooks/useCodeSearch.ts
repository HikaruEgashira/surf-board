import { useState, useCallback, useRef, useEffect } from 'react';
import type { CodeSearchResult, SearchResponse } from '../types';
import { useGitHubToken } from '../context/GitHubTokenContext';
import { useSearchSettings } from '../context/SearchSettingsContext';

const PER_PAGE = 30;
const MAX_ITEMS = 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const MAX_STORED_RESULTS = 300; // メモリ管理のための制限

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

  // レース・コンディション対策用のアボートコントローラー
  const abortControllerRef = useRef<AbortController | null>(null);
  // 最新のリクエストIDを追跡
  const requestIdRef = useRef<number>(0);

  const searchCode = useCallback(async (query: string, page = 1, retryCount = 0) => {
    if (!token) {
      setError('GitHub token is required. Please set it in the settings.');
      return;
    }

    if (query === '') {
      setResults([]);
      setHasMore(false);
      setCurrentQuery('');
      return;
    }

    // 前のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいアボートコントローラーを作成
    abortControllerRef.current = new AbortController();
    const currentRequestId = ++requestIdRef.current;

    try {
      setIsLoading(true);
      setError(null);

      if (page === 1) {
        setResults([]);
        setCurrentQuery(query);
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

      // リクエストがキャンセルされた場合は処理を中断
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // API制限エラーの場合
        if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
          const resetTime = response.headers.get('x-ratelimit-reset');
          const waitTime = resetTime ? parseInt(resetTime) * 1000 - Date.now() : 0;
          throw new Error(`API rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
        }

        // その他のエラー
        throw new Error(
          errorData.message ||
          `Failed to fetch code results: ${response.status} ${response.statusText}`
        );
      }

      const data: SearchResponse = await response.json();
      const totalPages = Math.ceil(Math.min(data.total_count, MAX_ITEMS) / PER_PAGE);

      setResults(prev => {
        let newResults = page === 1 ? data.items : [...prev, ...data.items];

        // プログラミング言語以外のファイルを除外
        if (excludeNonProgramming) {
          newResults = newResults.filter(item => isProgrammingFile(item.path));
        }

        // メモリ管理のための結果制限
        if (newResults.length > MAX_STORED_RESULTS) {
          newResults = newResults.slice(-MAX_STORED_RESULTS);
        }

        // フィルタリング後に結果が追加されたかチェック
        const hasNewResults = newResults.length > prev.length;
        setHasMore(page < totalPages && hasNewResults);

        return newResults;
      });

      setCurrentPage(page);

    } catch (err) {
      // アボートエラーは無視
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      console.error('Search error:', err);

      // リトライロジック
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

  // コンポーネントのアンマウント時にリクエストをキャンセル
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
  };
}
