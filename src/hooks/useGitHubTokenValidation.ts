import { useState } from 'react';

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

    const validateToken = async (token: string): Promise<boolean> => {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid GitHub token. Please check your token and try again.');
                }
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            return true;
        } catch (error) {
            setValidationError(error instanceof Error ? error.message : 'Failed to validate token');
            return false;
        }
    };

    const handleSave = async () => {
        if (!inputToken) {
            setValidationError('GitHub token is required');
            return;
        }

        const tokenPattern = /^gh[ps]_[a-zA-Z0-9]{36,251}$/;
        if (!tokenPattern.test(inputToken)) {
            setValidationError('Invalid token format. Token should start with "ghp_" or "ghs_"');
            return;
        }

        setIsValidating(true);
        setValidationError(null);

        try {
            const isValid = await validateToken(inputToken);
            if (isValid) {
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
