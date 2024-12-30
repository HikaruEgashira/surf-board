import { motion } from 'framer-motion';
import { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import CodeResult from '../CodeResult';
import CodeResultSkeleton from '../CodeResultSkeleton';
import { fadeIn, fadeInUp } from '../../animations';
import { containerStyles } from '../../utils/styles';
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
    {...fadeInUp}
    className="text-center py-8 text-gray-500 dark:text-gray-400"
  >
    <div className="text-sm">
      検索結果の最後に到達しました
    </div>
  </motion.div>
));

const PullToRefresh = memo(({ distance }: { distance: number }) => (
  <motion.div
    {...fadeInUp}
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

  if (results.length === 0 && !isLoading) {
    return null;
  }

  const isLastPage = !hasMore && results.length > 0;

  const Footer = () => (
    <div ref={bottomRef}>
      {isLoading && <LoadingSkeletons />}
      {!isLoading && !isLastPage && <div className="py-4" />}
      {isLastPage && <EndMessage />}
    </div>
  );

  return (
    <div className={containerStyles}>
      <div
        ref={containerRef}
        style={{ height: 'calc(100vh - 59px)' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pullDistance > 0 && <PullToRefresh distance={pullDistance} />}
        <Virtuoso
          style={{ height: '100%' }}
          data={results}
          endReached={() => {
            if (hasMore && !isLoading) {
              loadMore();
            }
          }}
          overscan={5}
          itemContent={(index, result) => (
            <motion.div key={`${result.sha}-${result.repository?.full_name}-${result.path}`} {...fadeIn}>
              <MemoizedCodeResult result={result} />
            </motion.div>
          )}
          components={{
            Footer
          }}
        />
      </div>
    </div>
  );
}
