import { motion, AnimatePresence } from 'framer-motion';
import { SearchInput } from '../SearchBar/SearchInput';
import { HeroContent } from './HeroContent';
import { HeroFeatures } from './HeroFeatures';
import CodeResultSkeleton from '../CodeResultSkeleton';
import { cn } from '../../utils/cn';
import { springTransition, fadeInUp, searchContainer } from '../../animations';
import { containerStyles } from '../../utils/styles';
import { useSearchContext } from '../../context/SearchContext';

export default function SearchHero() {
  const { isLoading, hasResults, isFocused } = useSearchContext();

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
          {!hasResults && !isLoading && !isFocused && (
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
            <SearchInput placeholder="Search code..." />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {(isLoading || isFocused) && !hasResults && (
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
