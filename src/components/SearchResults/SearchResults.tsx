import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import CodeResult from '../CodeResult';
import CodeResultSkeleton from '../CodeResultSkeleton';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import type { CodeSearchResult } from '../../types';
import { useEffect, useRef } from 'react';

interface SearchResultsProps {
  results: CodeSearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export default function SearchResults({ results, isLoading, hasMore, loadMore }: SearchResultsProps) {
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useInfiniteScroll(loadMore, { hasMore, isLoading });

  // 結果が0件の場合や、最後のアイテムがビューポートに入らない場合のフォールバック
  useEffect(() => {
    if (results.length === 0 && hasMore && !isLoading) {
      loadMore();
      return;
    }

    // 結果が少なく、スクロールが発生しない場合の処理
    if (observerTargetRef.current && hasMore && !isLoading) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(observerTargetRef.current);
      return () => observer.disconnect();
    }
  }, [results.length, hasMore, isLoading, loadMore]);

  console.log('SearchResults render:', {
    resultsCount: results.length,
    hasMore,
    isLoading
  });

  const containerClasses = cn(
    'divide-y divide-nord-4 dark:divide-nord-2 max-w-full',
    'mx-auto w-full rounded-lg overflow-hidden'
  );

  const getResultKey = (result: CodeSearchResult) => {
    return `${result.sha}-${result.repository?.full_name}-${result.path}`;
  };

  const renderResults = () => {
    if (results.length === 0) {
      return (
        <div ref={observerTargetRef} className="h-20" />
      );
    }

    return results.map((result, index) => (
      <div
        key={getResultKey(result)}
        ref={index === results.length - 1 ? lastItemRef : undefined}
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
