import { useEffect, RefObject } from 'react';

export const useSearchHotkey = (inputRef: RefObject<HTMLInputElement>): void => {
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
    }, [inputRef]);
};
