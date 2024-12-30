import { motion, AnimatePresence } from 'framer-motion';
import { SearchInput } from '../SearchBar/SearchInput';
import { HeroContent } from './HeroContent';
import { HeroFeatures } from './HeroFeatures';
import CodeResultSkeleton from '../CodeResultSkeleton';
import { cn } from '../../utils/cn';
import { springTransition, fadeInUp, searchContainer } from '../../animations';
import { containerStyles } from '../../utils/styles';
import { useSearchHero } from '../../hooks/useSearchHero';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  hasResults: boolean;
}

export default function SearchHero({ onSearch, isLoading, hasResults }: SearchHeroProps) {
  const {
    searchQuery,
    handleChange,
    handleSubmit,
    handleClear,
  } = useSearchHero({ onSearch });

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
              value={searchQuery}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClear={handleClear}
              placeholder="Search code..."
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
