import { useState, useRef, useCallback, useEffect, RefObject } from 'react';
import { useCodeSearch } from './useCodeSearch';
import type { CodeSearchResult } from '../types';
import type { SearchFilters } from '../context/SearchContext';

interface UseSearchProps {
    onClose?: () => void;
}

export const PULL_THRESHOLD = 100;

interface UseSearchReturn {
    // 検索状態
    query: string;
    results: CodeSearchResult[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    hasResults: boolean;
    isFocused: boolean;
    filters: SearchFilters;

    // 入力処理
    handleChange: (value: string) => void;
    handleSubmit: () => void;
    handleClear: () => void;
    handleBlur: () => void;
    handleFocus: () => void;

    // フィルター処理
    setFilter: (key: keyof SearchFilters, value: string) => void;
    removeFilter: (key: keyof SearchFilters) => void;
    clearFilters: () => void;

    // 無限スクロール
    loadMore: () => void;

    // プルトゥリフレッシュ
    pullDistance: number;
    isRefreshing: boolean;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchMove: (e: React.TouchEvent) => void;
    handleTouchEnd: () => void;

    // 参照
    inputRef: React.RefObject<HTMLInputElement>;
    bottomRef: RefObject<HTMLDivElement>;
    containerRef: RefObject<HTMLDivElement>;
}

export const useSearch = ({ onClose }: UseSearchProps = {}): UseSearchReturn => {
    // 検索状態の管理
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters>({});
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [startY, setStartY] = useState<number | null>(null);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const {
        results,
        isLoading,
        error,
        hasMore,
        searchCode,
        loadMore,
    } = useCodeSearch();

    // 入力処理
    const handleChange = useCallback((value: string) => {
        const trimmedValue = value.trim();
        setQuery(value);
        searchCode(trimmedValue);
    }, [searchCode]);

    const handleSubmit = useCallback(() => {
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            searchCode(trimmedQuery);
        }
    }, [query, searchCode]);

    const handleClear = useCallback(() => {
        setQuery('');
        searchCode('');
        onClose?.();
    }, [searchCode, onClose]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        if (query.trim() === '') {
            setQuery('');
        }
        setIsFocused(false);
    }, [query]);

    // スラッシュキーでの検索フォーカス
    // スラッシュキーでの検索フォーカス
    useEffect(() => {
        const handleSlashKey = (e: KeyboardEvent) => {
            if (
                e.key === '/' &&
                !e.metaKey &&
                !e.ctrlKey &&
                document.activeElement !== inputRef.current
            ) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleSlashKey);
        return () => window.removeEventListener('keydown', handleSlashKey);
    }, []);

    // 自動ロード機能
    useEffect(() => {
        if (hasMore && !isLoading && results.length > 0 && bottomRef.current) {
            const container = bottomRef.current.parentElement;
            if (container && container.clientHeight === container.scrollHeight) {
                loadMore();
            }
        }
    }, [hasMore, isLoading, results.length, loadMore]);

    const hasResults = query ? results.length > 0 : false;

    // プルトゥリフレッシュのハンドラー
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

    // リフレッシュ状態のリセット
    useEffect(() => {
        if (!isLoading) {
            setIsRefreshing(false);
        }
    }, [isLoading]);

    // フィルター処理
    const setFilter = useCallback((key: keyof SearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const removeFilter = useCallback((key: keyof SearchFilters) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    // フィルターが変更されたときに検索を実行
    useEffect(() => {
        if (query.trim()) {
            searchCode(query.trim());
        }
    }, [filters, query, searchCode]);

    return {
        // 検索状態
        query,
        results,
        isLoading,
        error,
        hasMore,
        hasResults,
        isFocused,
        filters,

        // 入力処理
        handleChange,
        handleSubmit,
        handleClear,
        handleBlur,
        handleFocus,

        // フィルター処理
        setFilter,
        removeFilter,
        clearFilters,

        // 無限スクロール
        loadMore,

        // プルトゥリフレッシュ
        pullDistance,
        isRefreshing,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,

        // 参照
        inputRef,
        bottomRef,
        containerRef,
    };
};
