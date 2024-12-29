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
}

export default function SearchResults({ results, isLoading, hasMore, loadMore }: SearchResultsProps) {
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
      </AnimatePresence>
    </div>
  );
}
