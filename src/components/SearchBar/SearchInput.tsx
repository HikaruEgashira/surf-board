import { Search, XCircle } from 'lucide-react';
import { useSearchContext } from '../../context/SearchContext';
import { SearchSuggestions } from './SearchSuggestions';
import { useSearchHistory } from '../../hooks/useSearchHistory';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = 'Search code...',
  className = '',
}: SearchInputProps) {
  const {
    query,
    handleChange,
    handleSubmit,
    handleClear,
    handleBlur,
    handleFocus,
    inputRef,
    isFocused,
    filters,
  } = useSearchContext();

  const {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getPopularQueries,
  } = useSearchHistory();

  const handleQuerySelect = (selectedQuery: string, selectedFilters?: any) => {
    handleChange(selectedQuery);
    if (selectedFilters) {
      // TODO: Apply filters from history
    }
    handleSubmit();
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      addToHistory(query, filters);
      handleSubmit();
    }
  };

  return (
    <div className={`relative flex-1 mx-auto group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearchSubmit();
          }
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="block w-full pl-9 pr-16 py-2 bg-white dark:bg-gray-800/95
                  border border-gray-300 dark:border-gray-700 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                  placeholder-gray-500 dark:placeholder-gray-500
                  text-gray-900 dark:text-gray-100
                  shadow-sm hover:border-gray-400 dark:hover:border-600
                  transition-colors duration-150"
        placeholder={placeholder}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
      <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-normal
                     text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800
                     border border-gray-200/70 dark:border-gray-700/50 rounded-[3px]">
        /
      </kbd>

      <SearchSuggestions
        history={history}
        popularQueries={getPopularQueries()}
        onSelectQuery={handleQuerySelect}
        onRemoveFromHistory={removeFromHistory}
        onClearHistory={clearHistory}
        isVisible={isFocused && !query}
      />
    </div>
  );
}
