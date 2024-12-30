import React from 'react';
import { Clock, Star, Trash2, TrendingUp } from 'lucide-react';
import type { SearchHistoryItem } from '../../hooks/useSearchHistory';

interface SearchSuggestionsProps {
  history: SearchHistoryItem[];
  popularQueries: string[];
  onSelectQuery: (query: string, filters?: SearchHistoryItem['filters']) => void;
  onRemoveFromHistory: (query: string) => void;
  onClearHistory: () => void;
  isVisible: boolean;
}

export function SearchSuggestions({
  history,
  popularQueries,
  onSelectQuery,
  onRemoveFromHistory,
  onClearHistory,
  isVisible,
}: SearchSuggestionsProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700 rounded-md shadow-lg 
                    max-h-96 overflow-y-auto z-50">
      {/* Recent Searches */}
      {history.length > 0 && (
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Recent Searches</h3>
            <button
              onClick={onClearHistory}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-200 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
          {history.map((item) => (
            <div
              key={`${item.query}-${item.timestamp}`}
              className="flex items-center justify-between group py-2 px-3 hover:bg-gray-50 
                       dark:hover:bg-gray-700/50 rounded-md cursor-pointer"
              onClick={() => onSelectQuery(item.query, item.filters)}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.query}</span>
                {item.filters && Object.keys(item.filters).length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    (with filters)
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromHistory(item.query);
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 
                         dark:hover:text-gray-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {popularQueries.length > 0 && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
            Popular Searches
          </h3>
          {popularQueries.map((query) => (
            <div
              key={query}
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 
                       rounded-md cursor-pointer"
              onClick={() => onSelectQuery(query)}
            >
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{query}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}