import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SearchSettingsContextType {
    excludeNonProgramming: boolean;
    setExcludeNonProgramming: (value: boolean) => void;
}

const STORAGE_KEY = 'searchSettings';

const SearchSettingsContext = createContext<SearchSettingsContextType | undefined>(undefined);

export function SearchSettingsProvider({ children }: { children: ReactNode }) {
    const [excludeNonProgramming, setExcludeNonProgramming] = useState(() => {
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        return savedSettings ? JSON.parse(savedSettings).excludeNonProgramming : false;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ excludeNonProgramming }));
    }, [excludeNonProgramming]);

    return (
        <SearchSettingsContext.Provider value={{ excludeNonProgramming, setExcludeNonProgramming }}>
            {children}
        </SearchSettingsContext.Provider>
    );
}

export function useSearchSettings() {
    const context = useContext(SearchSettingsContext);
    if (context === undefined) {
        throw new Error('useSearchSettings must be used within a SearchSettingsProvider');
    }
    return context;
}
