import { useState, useRef } from 'react';
import { GitHubTokenManager } from '../utils/tokenManager';
import { validateGitHubToken } from '../utils/validation';
import type { GitHubErrorResponse } from '../types/api';

interface UseGitHubTokenValidationProps {
    initialToken: string;
    onSave: (token: string) => void;
    onClose: () => void;
}

interface UseGitHubTokenValidationReturn {
    inputToken: string;
    setInputToken: (token: string) => void;
    isValidating: boolean;
    validationError: string | null;
    handleSave: () => Promise<void>;
}

export const useGitHubTokenValidation = ({
    initialToken,
    onSave,
    onClose,
}: UseGitHubTokenValidationProps): UseGitHubTokenValidationReturn => {
    const [inputToken, setInputToken] = useState(initialToken);
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const tokenManagerRef = useRef<GitHubTokenManager>(new GitHubTokenManager());

    const validateToken = async (token: string): Promise<boolean> => {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Unknown error',
                    documentation_url: null
                } as GitHubErrorResponse));

                if (response.status === 401) {
                    throw new Error('Invalid GitHub token. Please check your token and try again.');
                }
                throw new Error(errorData.message || `GitHub API error: ${response.status} ${response.statusText}`);
            }

            return true;
        } catch (error) {
            setValidationError(error instanceof Error ? error.message : 'Failed to validate token');
            return false;
        }
    };

    const handleSave = async () => {
        const validationResult = validateGitHubToken(inputToken);
        if (!validationResult.isValid) {
            setValidationError(validationResult.errors.join(', '));
            return;
        }

        setIsValidating(true);
        setValidationError(null);

        try {
            const isValid = await validateToken(inputToken);
            if (isValid) {
                await tokenManagerRef.current.setToken(inputToken);
                onSave(inputToken);
                onClose();
            }
        } finally {
            setIsValidating(false);
        }
    };

    return {
        inputToken,
        setInputToken,
        isValidating,
        validationError,
        handleSave,
    };
};
