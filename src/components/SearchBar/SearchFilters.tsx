import React from 'react';
import { X } from 'lucide-react';

interface SearchFilter {
  key: string;
  value: string;
}

interface SearchFiltersProps {
  filters: SearchFilter[];
  onRemoveFilter: (key: string) => void;
}

export function SearchFilters({ filters, onRemoveFilter }: SearchFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                   bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          <span className="font-medium">{filter.key}:</span>
          {filter.value}
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="ml-1 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}