import SearchHero from './SearchHero';
import SearchResults from './SearchResults';
import MainLayout from '../layouts/MainLayout';
import { SearchProvider, useSearchContext } from '../context/SearchContext';

function AppContent() {
    const {
        query,
        results,
        isLoading,
        error,
    } = useSearchContext();

    return (
        <MainLayout error={error}>
            <SearchHero />
            {query && results.length > 0 && (
                <SearchResults />
            )}
        </MainLayout>
    );
}

export function AppContentWithProvider() {
    return (
        <SearchProvider>
            <AppContent />
        </SearchProvider>
    );
}
