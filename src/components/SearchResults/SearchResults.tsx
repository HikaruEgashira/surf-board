import { motion } from 'framer-motion';
import { memo } from 'react';
import CodeResult from '../CodeResult';
import CodeResultSkeleton from '../CodeResultSkeleton';
import { fadeIn } from '../../animations';
import { containerStyles } from '../../utils/styles';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useSearchContext } from '../../context/SearchContext';

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

const PullToRefresh = memo(({ distance }: { distance: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-4 text-gray-500 dark:text-gray-400"
    style={{ transform: `translateY(${Math.min(distance, 100)}px)` }}
  >
    <div className="text-sm">
      {distance >= 100 ? '更新するには離してください' : '引っ張って更新'}
    </div>
  </motion.div>
));

export default function SearchResults() {
  const {
    results,
    isLoading,
    hasMore,
    loadMore,
    pullDistance,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    bottomRef,
    containerRef,
  } = useSearchContext();

  useInfiniteScroll(loadMore, bottomRef, {
    isLoading,
    hasMore,
    threshold: 300,
  });

  if (results.length === 0 && !isLoading) {
    return null;
  }

  const isLastPage = !hasMore && results.length > 0;

  return (
    <div className={containerStyles}>
      <div
        ref={containerRef}
        style={{ height: 'calc(100vh - 59px)', overflowY: 'auto' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pullDistance > 0 && <PullToRefresh distance={pullDistance} />}
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
