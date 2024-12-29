import { useCallback, useRef, useEffect } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  debounceMs?: number;
}

export function useInfiniteScroll(
  loadMore: () => void,
  { hasMore, isLoading, threshold = 0.8, debounceMs = 500 }: UseInfiniteScrollOptions
) {
  const observer = useRef<IntersectionObserver>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const loadMoreRef = useRef(loadMore);

  // loadMore関数への参照を更新
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  const debouncedLoadMore = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      loadMoreRef.current();
    }, debounceMs);
  }, [debounceMs]);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          console.log('Intersection Observer:', {
            isIntersecting: entries[0].isIntersecting,
            hasMore,
            isLoading,
            threshold
          });

          if (entries[0].isIntersecting && hasMore && !isLoading) {
            console.log('Loading more results...');
            debouncedLoadMore();
          }
        },
        {
          threshold,
          rootMargin: '100px' // 事前読み込みのための余裕
        }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, isLoading, threshold, debouncedLoadMore]
  );

  // クリーンアップ
  useEffect(() => {
    const currentTimeout = timeoutRef.current;
    const currentObserver = observer.current;

    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, []);

  return lastElementRef;
}
