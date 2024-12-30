import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useSearchContext } from '../../context/SearchContext';
import type { SearchFilters as SearchFiltersType } from '../../context/SearchContext';

const LANGUAGE_OPTIONS = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust'];
const STARS_OPTIONS = ['10+', '100+', '1000+', '10000+'];
const UPDATED_OPTIONS = ['today', 'this week', 'this month', 'this year'];

export function SearchFilters() {
  const { filters, setFilter, removeFilter, clearFilters } = useSearchContext();
  const [isOpen, setIsOpen] = useState(false);

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-2 py-1 text-sm rounded-md
                   ${hasFilters 
                     ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                     : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                   } hover:bg-opacity-80`}
      >
        <Filter className="w-4 h-4" />
        Filters {hasFilters && `(${Object.keys(filters).length})`}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Language Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={filters.language || ''}
                onChange={(e) => setFilter('language', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                         rounded-md shadow-sm py-1 px-2 text-sm"
              >
                <option value="">Any</option>
                {LANGUAGE_OPTIONS.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Stars Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Stars
              </label>
              <select
                value={filters.stars || ''}
                onChange={(e) => setFilter('stars', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                         rounded-md shadow-sm py-1 px-2 text-sm"
              >
                <option value="">Any</option>
                {STARS_OPTIONS.map(stars => (
                  <option key={stars} value={stars}>{stars}</option>
                ))}
              </select>
            </div>

            {/* Updated Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Updated
              </label>
              <select
                value={filters.updatedAt || ''}
                onChange={(e) => setFilter('updatedAt', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                         rounded-md shadow-sm py-1 px-2 text-sm"
              >
                <option value="">Any time</option>
                {UPDATED_OPTIONS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="w-full text-center text-sm text-red-600 dark:text-red-400 
                         hover:text-red-700 dark:hover:text-red-300"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          {(Object.entries(filters) as [keyof SearchFiltersType, string][]).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                       bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
            >
              <span className="font-medium">{key}:</span>
              {value}
              <button
                onClick={() => removeFilter(key)}
                className="ml-1 p-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
