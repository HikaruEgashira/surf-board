import { motion, AnimatePresence } from 'framer-motion';
import CodeResult from '../CodeResult';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import type { CodeSearchResult } from '../../types';
import { useEffect, useRef } from 'react';
import { fadeIn } from '../../layers/animation';
import { containerStyles } from '../../utils/styles';

interface SearchResultsProps {
  results: CodeSearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export default function SearchResults({ results, isLoading, hasMore, loadMore }: SearchResultsProps) {
  const lastItemRef = useInfiniteScroll(loadMore, { hasMore, isLoading });

  // 結果が0件の場合のフォールバック
  useEffect(() => {
    if (results.length === 0 && hasMore && !isLoading) {
      loadMore();
    }
  }, [results.length, hasMore, isLoading, loadMore]);

  const getResultKey = (result: CodeSearchResult) => {
    return `${result.sha}-${result.repository?.full_name}-${result.path}`;
  };

  const renderResults = () => {
    if (results.length === 0) {
      return null;
    }

    return results.map((result, index) => (
      <div
        key={getResultKey(result)}
        ref={index === results.length - 1 ? lastItemRef : undefined}
      >
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
      </AnimatePresence>
    </div>
  );
}
