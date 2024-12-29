import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../SearchBar';
import { HeroContent } from './HeroContent';
import { HeroFeatures } from './HeroFeatures';
import CodeResultSkeleton from '../CodeResultSkeleton';
import { cn } from '../../utils/cn';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  hasResults: boolean;
}

export default function SearchHero({ onSearch, isLoading, hasResults }: SearchHeroProps) {
  const containerClasses = cn(
    'divide-y divide-nord-4 dark:divide-nord-2 max-w-full',
    'mx-auto w-full rounded-lg overflow-hidden'
  );

  return (
    <motion.div
      className={cn(
        'w-full',
        (hasResults || isLoading) && 'border-b border-gray-200 dark:border-gray-700'
      )}
      initial={false}
      layout
      transition={{
        duration: 0.3,
        type: "spring",
        bounce: 0.1,
        damping: 15
      }}
    >
      <motion.div
        className="flex flex-col items-center gap-2 flex-1 px-4"
        layout
        transition={{
          duration: 0.3,
          type: "spring",
          bounce: 0.1,
          damping: 15
        }}
      >
        <AnimatePresence mode="wait">
          {!hasResults && !isLoading && (
            <motion.div
              className="flex-1 flex items-center py-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                type: "spring",
                damping: 15
              }}
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
          initial={false}
          animate={{
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 1
            }
          }}
        >
          <motion.div layout>
            <SearchBar onSearch={onSearch} isLoading={isLoading} />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isLoading && !hasResults && (
            <div className={containerClasses}>
              {[...Array(10)].map((_, index) => (
                <CodeResultSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          )}
          {isLoading && hasResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              <CodeResultSkeleton />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!hasResults && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HeroFeatures />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
