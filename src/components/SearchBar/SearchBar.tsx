import { useState } from 'react';
import { SearchInput } from './SearchInput';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

export default function SearchBar({ onSearch, isLoading, initialQuery = '' }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialQuery);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleBlur = () => {
    if (!inputValue.trim()) {
      onSearch('');
    }
  };

  return (
    <div className="w-full">
      <SearchInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        onBlur={handleBlur}
        placeholder="Search code..."
        debounceDelay={500}
      />
    </div>
  );
}
