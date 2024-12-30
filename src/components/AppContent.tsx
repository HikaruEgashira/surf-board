import SearchHero from './SearchHero';
import SearchResults from './SearchResults';
import MainLayout from '../layouts/MainLayout';
import { useSearch } from '../hooks/useSearch';

export function AppContent() {
    const {
        query,
        results,
        isLoading,
        error,
        hasMore,
        loadMore,
    } = useSearch();

    return (
        <MainLayout error={error}>
            <SearchHero />
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
