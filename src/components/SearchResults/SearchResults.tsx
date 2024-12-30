import { motion } from 'framer-motion';
import { useRef, memo, useEffect, useState } from 'react';
import CodeResult from '../CodeResult';
import CodeResultSkeleton from '../CodeResultSkeleton';
import type { CodeSearchResult } from '../../types';
import { fadeIn } from '../../animations';
import { containerStyles } from '../../utils/styles';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const PULL_THRESHOLD = 100; // プルトゥリフレッシュのしきい値（ピクセル）

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

const PullToRefresh = memo(({ distance }: { distance: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-4 text-gray-500 dark:text-gray-400"
    style={{ transform: `translateY(${Math.min(distance, PULL_THRESHOLD)}px)` }}
  >
    <div className="text-sm">
      {distance >= PULL_THRESHOLD ? '更新するには離してください' : '引っ張って更新'}
    </div>
  </motion.div>
));

export default function SearchResults({ results, isLoading, hasMore, loadMore, isLastPage }: SearchResultsProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null && containerRef.current?.scrollTop === 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;
      if (distance > 0) {
        setPullDistance(distance);
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      loadMore();
    }
    setStartY(null);
    setPullDistance(0);
  };

  useEffect(() => {
    if (!isLoading) {
      setIsRefreshing(false);
    }
  }, [isLoading]);

  if (results.length === 0 && !isLoading) {
    return null;
  }

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
