import SearchHero from './SearchHero';
import SearchResults from './SearchResults';
import MainLayout from '../layouts/MainLayout';
import { useSearchState } from '../hooks/useSearchState';

export function AppContent() {
    const {
        query,
        results,
        isLoading,
        error,
        hasMore,
        loadMore,
        handleSearch,
        hasResults,
    } = useSearchState();

    return (
        <MainLayout error={error}>
            <SearchHero
                onSearch={handleSearch}
                isLoading={isLoading}
                hasResults={hasResults}
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
