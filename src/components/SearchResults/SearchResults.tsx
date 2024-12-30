import { motion, AnimatePresence } from 'framer-motion';
import { useRef, memo, useCallback, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
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
    // 検索結果が少なく、スクロールが発生しない場合でも
    // 追加データの読み込みをトリガーする
    if (hasMore && !isLoading && results.length > 0 && bottomRef.current) {
      const container = document.querySelector('.virtuoso-scroller');
      if (container && container.clientHeight === container.scrollHeight) {
        loadMore();
      }
    }
  }, [hasMore, isLoading, results.length, loadMore]);

  useInfiniteScroll(loadMore, bottomRef, {
    isLoading,
    hasMore,
    threshold: 300, // より早めに次のデータを読み込む
  });

  const getResultKey = useCallback((result: CodeSearchResult) => {
    return `${result.sha}-${result.repository?.full_name}-${result.path}`;
  }, []);

  const renderItem = useCallback((_: number, result: CodeSearchResult) => (
    <motion.div {...fadeIn}>
      <MemoizedCodeResult result={result} />
    </motion.div>
  ), []);

  if (results.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className={containerStyles}>
      <AnimatePresence>
        <Virtuoso
          style={{ height: 'calc(100vh - 59px)' }}
          data={results}
          itemContent={(index, result) => renderItem(index, result)}
          computeItemKey={(_, result) => getResultKey(result)}
          components={{
            Footer: () => (
              <div ref={bottomRef}>
                {isLoading && <LoadingSkeletons />}
                {!isLoading && !isLastPage && <div className="py-4" />}
                {isLastPage && <EndMessage />}
              </div>
            ),
          }}
          increaseViewportBy={500}
          overscan={10}
        />
      </AnimatePresence>
    </div>
  );
}
