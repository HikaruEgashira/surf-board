import { useEffect, useRef, useState } from 'react';
import { useCodeSearch } from './useCodeSearch';
import type { CodeSearchResult } from '../types';

interface UseSearchStateReturn {
    query: string;
    results: CodeSearchResult[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    handleSearch: (newQuery: string) => void;
    hasResults: boolean;
}

export const useSearchState = (): UseSearchStateReturn => {
    const [query, setQuery] = useState('');
    const { results, isLoading, error, hasMore, searchCode, loadMore } = useCodeSearch();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (query) {
                searchCode(query);
            }
        }
    }, [query, searchCode]);

    const handleSearch = (newQuery: string) => {
        setQuery(newQuery);
        searchCode(newQuery);
    };

    const hasResults = query ? results.length > 0 : false;

    return {
        query,
        results,
        isLoading,
        error,
        hasMore,
        loadMore,
        handleSearch,
        hasResults,
    };
};
