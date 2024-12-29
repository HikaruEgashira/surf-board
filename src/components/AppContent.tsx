import { useEffect, useRef } from 'react';
import SearchHero from './SearchHero';
import SearchResults from './SearchResults';
import { useCodeSearch } from '../hooks/useCodeSearch';
import { useUrlState } from '../hooks/useUrlState';
import MainLayout from '../layouts/MainLayout';

export function AppContent() {
    const [query, setQuery] = useUrlState<string>('q', '');
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

    return (
        <MainLayout error={error}>
            <SearchHero
                onSearch={handleSearch}
                isLoading={isLoading}
                hasResults={query ? results.length > 0 : false}
            />
            {query && results.length > 0 && (
                <SearchResults
                    results={results}
                    isLoading={isLoading}
                    hasMore={hasMore}
                    loadMore={loadMore}
                />
            )}
        </MainLayout>
    );
}
