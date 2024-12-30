import { useState } from 'react';

interface UseSearchHeroProps {
    onSearch: (query: string) => void;
}

interface UseSearchHeroReturn {
    searchQuery: string;
    handleChange: (value: string) => void;
    handleSubmit: () => void;
    handleClear: () => void;
}

export const useSearchHero = ({ onSearch }: UseSearchHeroProps): UseSearchHeroReturn => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleChange = (value: string) => {
        setSearchQuery(value);
        onSearch(value.trim());
    };

    const handleSubmit = () => {
        onSearch(searchQuery.trim());
    };

    const handleClear = () => {
        setSearchQuery('');
        onSearch('');
    };

    return {
        searchQuery,
        handleChange,
        handleSubmit,
        handleClear,
    };
};
