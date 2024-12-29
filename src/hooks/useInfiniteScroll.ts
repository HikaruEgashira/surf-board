import { useCallback, useRef, useEffect } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export function useInfiniteScroll(
  loadMore: () => void,
  { hasMore, isLoading, threshold = 0.8 }: UseInfiniteScrollOptions
) {
  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            loadMore();
          }
        },
        { threshold }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [loadMore, hasMore, isLoading, threshold]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
}
