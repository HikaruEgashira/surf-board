import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import CodeResult from '../CodeResult';
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
    if (results.length === 0) {
      return null;
    }

    return results.map((result) => (
      <div key={getResultKey(result)}>
        <motion.div {...fadeIn}>
          <CodeResult result={result} />
        </motion.div>
      </div>
    ));
  };

  return (
    <div className={containerStyles}>
      <AnimatePresence>
        {renderResults()}
        {(isLoading || hasMore) && (
          <div ref={bottomRef} className="py-4 text-center">
            {isLoading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
