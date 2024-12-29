import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import CodeResult from '../CodeResult';
import CodeResultSkeleton from '../CodeResultSkeleton';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import type { CodeSearchResult } from '../../types';

interface SearchResultsProps {
  results: CodeSearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export default function SearchResults({ results, isLoading, hasMore, loadMore }: SearchResultsProps) {
  const lastItemRef = useInfiniteScroll(loadMore, { hasMore, isLoading });

  console.log('SearchResults render:', {
    resultsCount: results.length,
    hasMore,
    isLoading
  });

  const containerClasses = cn(
    'divide-y divide-nord-4 dark:divide-nord-2 max-w-full',
    'mx-auto w-full rounded-lg overflow-hidden'
  );

  // Create a unique key for each result
  const getResultKey = (result: CodeSearchResult) => {
    return `${result.sha}-${result.repository?.full_name}-${result.path}`;
  };

  const renderResults = () => {
    return results.map((result, index) => (
      <div
        key={getResultKey(result)}
        ref={index === results.length - 1 && hasMore && !isLoading ? lastItemRef : undefined}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
        >
          <CodeResult result={result} />
        </motion.div>
      </div>
    ));
  };

  return (
    <div className={containerClasses}>
      <AnimatePresence>
        {renderResults()}
        {isLoading && (
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
    </div>
  );
}
