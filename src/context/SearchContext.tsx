import { createContext, useContext, ReactNode } from 'react';
import { useSearch } from '../hooks/useSearch';
import type { CodeSearchResult } from '../types';

export interface SearchFilters {
    language?: string;
    stars?: string;
    updatedAt?: string;
}

interface SearchContextValue {
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
    bottomRef: React.RefObject<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement>;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
    const searchState = useSearch();

    return (
        <SearchContext.Provider value={searchState}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearchContext() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
}
