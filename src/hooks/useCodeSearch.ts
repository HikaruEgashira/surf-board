import { useState, useCallback } from 'react';
import type { CodeSearchResult, SearchResponse } from '../types';
import { useGitHubToken } from '../context/GitHubTokenContext';
import { useSearchSettings } from '../context/SearchSettingsContext';

const PER_PAGE = 30;
const MAX_ITEMS = 1000;

// プログラミング言語の拡張子リスト
const PROGRAMMING_EXTENSIONS = new Set([
  // JavaScript/TypeScript
  'js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs',
  // Python
  'py', 'pyw', 'pyx',
  // Ruby
  'rb', 'rake', 'gemspec',
  // PHP
  'php', 'php3', 'php4', 'php5', 'phtml',
  // Java
  'java', 'class', 'jar',
  // C/C++
  'c', 'cpp', 'cc', 'cxx', 'h', 'hpp',
  // C#
  'cs', 'csx',
  // Go
  'go',
  // Rust
  'rs',
  // Swift
  'swift',
  // Kotlin
  'kt', 'kts',
  // その他
  'scala', 'hs', 'ex', 'lua', 'r', 'sh',
  'sql', 'pl', 'pm', 'vue', 'svelte', 'dart', 'elm',
]);

// 非プログラミングファイルの拡張子
const NON_PROGRAMMING_EXTENSIONS = new Set([
  'md', 'markdown', 'txt', 'doc', 'docx',
  'pdf', 'csv', 'json', 'xml', 'yaml', 'yml',
  'html', 'htm', 'css', 'scss', 'sass',
  'png', 'jpg', 'jpeg', 'gif', 'svg',
  'mp3', 'mp4', 'wav', 'avi',
  'zip', 'tar', 'gz', 'rar',
]);

const isProgrammingFile = (path: string): boolean => {
  // 拡張子でチェック
  const filename = path.split('/').pop() || '';
  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return false;

  // 明示的に非プログラミングファイルとして定義されている場合は除外
  if (NON_PROGRAMMING_EXTENSIONS.has(extension)) return false;

  return PROGRAMMING_EXTENSIONS.has(extension);
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

  const searchCode = useCallback(async (query: string, page = 1) => {
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

    try {
      setIsLoading(true);
      setError(null);

      if (page === 1) {
        setResults([]);
        setCurrentQuery(query);
      }

      const url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${page}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.v3.text-match+json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(
          errorData.message ||
          `Failed to fetch code results: ${response.status} ${response.statusText}`
        );
      }

      const data: SearchResponse = await response.json();
      console.log('Search results:', {
        total_count: data.total_count,
        items_count: data.items.length,
      });

      const totalPages = Math.ceil(Math.min(data.total_count, MAX_ITEMS) / PER_PAGE);

      setResults(prev => {
        let newResults = page === 1 ? data.items : [...prev, ...data.items];

        // プログラミング言語以外のファイルを除外
        if (excludeNonProgramming) {
          newResults = newResults.filter(item => isProgrammingFile(item.path));
        }

        console.log('Updated results:', {
          previousCount: prev.length,
          newCount: newResults.length,
          filtered: excludeNonProgramming,
          filteredCount: newResults.length,
        });

        return newResults;
      });

      setHasMore(page < totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [token, excludeNonProgramming]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && currentQuery) {
      searchCode(currentQuery, currentPage + 1);
    }
  }, [isLoading, hasMore, currentQuery, currentPage, searchCode]);

  return {
    results,
    isLoading,
    error,
    hasMore,
    searchCode,
    loadMore,
  };
}
