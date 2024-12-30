import { useState, useEffect, RefObject } from 'react';

export const PULL_THRESHOLD = 100;

interface UsePullToRefreshProps {
    containerRef: RefObject<HTMLDivElement>;
    onRefresh: () => void;
    isLoading: boolean;
}

interface PullToRefreshState {
    pullDistance: number;
    isRefreshing: boolean;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchMove: (e: React.TouchEvent) => void;
    handleTouchEnd: () => void;
}

export const usePullToRefresh = ({
    containerRef,
    onRefresh,
    isLoading,
}: UsePullToRefreshProps): PullToRefreshState => {
    const [startY, setStartY] = useState<number | null>(null);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

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
            onRefresh();
        }
        setStartY(null);
        setPullDistance(0);
    };

    useEffect(() => {
        if (!isLoading) {
            setIsRefreshing(false);
        }
    }, [isLoading]);

    return {
        pullDistance,
        isRefreshing,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
};
