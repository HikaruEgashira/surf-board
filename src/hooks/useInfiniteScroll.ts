import { useEffect, useRef, RefObject } from 'react';

interface UseInfiniteScrollOptions {
    threshold?: number;
    isLoading?: boolean;
    hasMore?: boolean;
}

export function useInfiniteScroll(
    callback: () => void,
    targetRef: RefObject<HTMLElement>,
    { threshold = 100, isLoading = false, hasMore = false }: UseInfiniteScrollOptions = {}
) {
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const currentTarget = targetRef.current;
        if (!currentTarget || isLoading || !hasMore) return;

        observer.current = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    callback();
                }
            },
            {
                rootMargin: `0px 0px ${threshold}px 0px`,
            }
        );

        observer.current.observe(currentTarget);

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [callback, targetRef, threshold, isLoading, hasMore]);
}
