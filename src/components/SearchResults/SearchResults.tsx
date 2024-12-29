import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import CodeResult from '../CodeResult';
import CodeResultSkeleton from '../CodeResultSkeleton';
import type { CodeSearchResult } from '../../types';
import { fadeIn } from '../../animations';
import { containerStyles } from '../../utils/styles';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface SearchResultsProps {
  results: CodeSearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  isLastPage?: boolean;
}

export default function SearchResults({ results, isLoading, hasMore, loadMore, isLastPage }: SearchResultsProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useInfiniteScroll(loadMore, bottomRef, {
    isLoading,
    hasMore,
  });

  const getResultKey = (result: CodeSearchResult) => {
    return `${result.sha}-${result.repository?.full_name}-${result.path}`;
  };

  const renderResults = () => {
    if (results.length === 0 && !isLoading) {
      return null;
    }

    return (
      <>
        {results.map((result) => (
          <div key={getResultKey(result)}>
            <motion.div {...fadeIn}>
              <CodeResult result={result} />
            </motion.div>
          </div>
        ))}
        {isLoading && (
          <>
            <CodeResultSkeleton />
            <CodeResultSkeleton />
            <CodeResultSkeleton />
          </>
        )}
      </>
    );
  };

  return (
    <div className={containerStyles}>
      <AnimatePresence>
        {renderResults()}
        {hasMore && !isLoading && (
          <div ref={bottomRef} className="py-4" />
        )}
        {isLastPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            <div className="text-sm">
              検索結果の最後に到達しました
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
