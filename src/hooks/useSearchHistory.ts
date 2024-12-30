import { useState, useCallback, useEffect } from 'react';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  filters?: {
    language?: string;
    stars?: string;
    updatedAt?: string;
  };
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((query: string, filters?: SearchHistoryItem['filters']) => {
    if (!query.trim()) return;
    
    setHistory(prev => {
      // Remove any existing entries with the same query
      const filtered = prev.filter(item => item.query !== query);
      
      // Add new entry at the beginning
      const newHistory = [
        { query, timestamp: Date.now(), filters },
        ...filtered,
      ].slice(0, MAX_HISTORY_ITEMS); // Keep only the most recent items
      
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => prev.filter(item => item.query !== query));
  }, []);

  const getPopularQueries = useCallback(() => {
    // Count query occurrences and sort by frequency
    const queryCounts = history.reduce((acc, item) => {
      acc[item.query] = (acc[item.query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(queryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([query]) => query);
  }, [history]);

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getPopularQueries,
  };
}