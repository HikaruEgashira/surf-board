import { useState, useRef, useCallback, useEffect } from 'react';
import { useCodeSearch } from './useCodeSearch';
import type { CodeSearchResult } from '../types';

interface UseSearchProps {
    onClose?: () => void;
}

interface UseSearchReturn {
    // 検索状態
    query: string;
    results: CodeSearchResult[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    hasResults: boolean;

    // 入力処理
    handleChange: (value: string) => void;
    handleSubmit: () => void;
    handleClear: () => void;
    handleBlur: () => void;

    // 無限スクロール
    loadMore: () => void;

    // 入力参照
    inputRef: React.RefObject<HTMLInputElement>;
}

export const useSearch = ({ onClose }: UseSearchProps = {}): UseSearchReturn => {
    // 検索状態の管理
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
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

    const handleBlur = useCallback(() => {
        if (query.trim() === '') {
            setQuery('');
        }
    }, [query]);

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

    const hasResults = query ? results.length > 0 : false;

    return {
        // 検索状態
        query,
        results,
        isLoading,
        error,
        hasMore,
        hasResults,

        // 入力処理
        handleChange,
        handleSubmit,
        handleClear,
        handleBlur,

        // 無限スクロール
        loadMore,

        // 入力参照
        inputRef,
    };
};
