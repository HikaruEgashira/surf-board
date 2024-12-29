import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { SearchInput } from '../SearchBar/SearchInput';
import { HeroContent } from './HeroContent';
import { HeroFeatures } from './HeroFeatures';
import CodeResultSkeleton from '../CodeResultSkeleton';
import { cn } from '../../utils/cn';
import { springTransition, fadeInUp, searchContainer } from '../../animations';
import { containerStyles } from '../../utils/styles';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  hasResults: boolean;
}

export default function SearchHero({ onSearch, isLoading, hasResults }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useUrlState<string>('q', '');
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    if (searchQuery) {
      onSearch(searchQuery);
    }
  }, []);

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      setSearchQuery(trimmedValue);
      onSearch(trimmedValue);
    }
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    const trimmedValue = value.trim();
    if (trimmedValue.length >= 3 || trimmedValue === '') {
      setSearchQuery(trimmedValue);
      onSearch(trimmedValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
    onSearch('');
  };

  return (
    <motion.div
      className={cn(
        'w-full',
        (hasResults || isLoading) && 'border-b border-gray-200 dark:border-gray-700'
      )}
      initial={false}
      layout
      transition={springTransition}
    >
      <motion.div
        className="flex flex-col items-center gap-2 flex-1 px-4"
        layout
        transition={springTransition}
      >
        <AnimatePresence mode="wait">
          {!hasResults && !isLoading && (
            <motion.div
              className="flex-1 flex items-center py-3"
              {...fadeInUp}
            >
              <HeroContent />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layoutId="search-container"
          className={cn(
            "w-full mx-auto py-2",
            hasResults || isLoading ? "max-w-full" : "max-w-xl"
          )}
          {...searchContainer}
        >
          <motion.div layout>
            <SearchInput
              value={inputValue}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClear={handleClear}
              placeholder="Search code..."
              debounceDelay={500}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isLoading && !hasResults && (
            <div className={containerStyles}>
              {[...Array(10)].map((_, index) => (
                <CodeResultSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!hasResults && !isLoading && (
            <motion.div
              {...fadeInUp}
            >
              <HeroFeatures />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
