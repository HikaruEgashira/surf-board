import { motion } from 'framer-motion';
import { useRef, memo, useEffect } from 'react';
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

const MemoizedCodeResult = memo(CodeResult);

const LoadingSkeletons = memo(() => (
  <>
    <CodeResultSkeleton />
    <CodeResultSkeleton />
    <CodeResultSkeleton />
  </>
));

const EndMessage = memo(() => (
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
));

export default function SearchResults({ results, isLoading, hasMore, loadMore, isLastPage }: SearchResultsProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasMore && !isLoading && results.length > 0 && bottomRef.current) {
      const container = bottomRef.current.parentElement;
      if (container && container.clientHeight === container.scrollHeight) {
        loadMore();
      }
    }
  }, [hasMore, isLoading, results.length, loadMore]);

  useInfiniteScroll(loadMore, bottomRef, {
    isLoading,
    hasMore,
    threshold: 300,
  });

  if (results.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className={containerStyles}>
      <div style={{ height: 'calc(100vh - 59px)', overflowY: 'auto' }}>
        {results.map(result => (
          <motion.div key={`${result.sha}-${result.repository?.full_name}-${result.path}`} {...fadeIn}>
            <MemoizedCodeResult result={result} />
          </motion.div>
        ))}
        <div ref={bottomRef}>
          {isLoading && <LoadingSkeletons />}
          {!isLoading && !isLastPage && <div className="py-4" />}
          {isLastPage && <EndMessage />}
        </div>
      </div>
    </div>
  );
}
