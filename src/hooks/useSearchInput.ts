import { useCallback } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

interface UseSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onBlur?: () => void;
}

interface UseSearchInputReturn {
    handleKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => void;
    handleChange: (value: string) => void;
    handleBlur: () => void;
}

export const useSearchInput = ({
    value,
    onChange,
    onSubmit,
    onBlur,
}: UseSearchInputProps): UseSearchInputReturn => {
    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    const handleBlur = useCallback(() => {
        if (value.trim() === '') {
            onChange('');
        }
        onBlur?.();
    }, [value, onChange, onBlur]);

    const handleChange = (newValue: string) => {
        onChange(newValue);
        onSubmit();
    };

    return {
        handleKeyDown,
        handleChange,
        handleBlur,
    };
};
