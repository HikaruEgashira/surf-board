import { useEffect, RefObject } from 'react';

interface UseAutoLoadProps {
    bottomRef: RefObject<HTMLDivElement>;
    hasMore: boolean;
    isLoading: boolean;
    resultsLength: number;
    loadMore: () => void;
}

export const useAutoLoad = ({
    bottomRef,
    hasMore,
    isLoading,
    resultsLength,
    loadMore,
}: UseAutoLoadProps): void => {
    useEffect(() => {
        if (hasMore && !isLoading && resultsLength > 0 && bottomRef.current) {
            const container = bottomRef.current.parentElement;
            if (container && container.clientHeight === container.scrollHeight) {
                loadMore();
            }
        }
    }, [hasMore, isLoading, resultsLength, loadMore, bottomRef]);
};
