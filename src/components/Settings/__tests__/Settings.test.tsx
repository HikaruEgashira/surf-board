import { render, screen, fireEvent } from '@testing-library/react';
import { Settings } from '../Settings';
import { useGitHubTokenValidation } from '../../../hooks/useGitHubTokenValidation';

// Mock all the hooks
jest.mock('../../../context/GitHubTokenContext', () => ({
    useGitHubToken: () => ({
        token: '',
        setToken: jest.fn(),
    }),
}));
jest.mock('../../../context/SearchSettingsContext', () => ({
    useSearchSettings: () => ({
        excludeNonProgramming: false,
        setExcludeNonProgramming: jest.fn(),
    }),
}));
jest.mock('../../../context/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light',
        setTheme: jest.fn(),
    }),
}));
jest.mock('../../../hooks/useGitHubTokenValidation');

describe('Settings', () => {
    const mockOnClose = jest.fn();
    
    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup default mock implementation for useGitHubTokenValidation
        (useGitHubTokenValidation as jest.Mock).mockReturnValue({
            inputToken: '',
            setInputToken: jest.fn(),
            isValidating: false,
            validationError: null,
            handleSave: jest.fn(),
        });
    });

    it('renders GitHub token input with proper attributes', () => {
        render(<Settings onClose={mockOnClose} />);
        
        const tokenInput = screen.getByLabelText('GitHub Personal Access Token');
        expect(tokenInput).toHaveAttribute('type', 'password');
        expect(tokenInput).toHaveAttribute('pattern', '^gh[pso]_[a-zA-Z0-9]{36,251}$');
        expect(tokenInput).toHaveAttribute('placeholder', 'ghp_xxxxxxxxxxxxxxxxxxxx');
    });

    it('shows validation error with proper styling', () => {
        (useGitHubTokenValidation as jest.Mock).mockReturnValue({
            inputToken: 'invalid_token',
            setInputToken: jest.fn(),
            isValidating: false,
            validationError: 'Invalid token format',
            handleSave: jest.fn(),
        });

        render(<Settings onClose={mockOnClose} />);
        
        expect(screen.getByText('Token Validation Failed')).toBeInTheDocument();
        expect(screen.getByText('Invalid token format')).toBeInTheDocument();
    });

    it('shows loading state during validation', () => {
        (useGitHubTokenValidation as jest.Mock).mockReturnValue({
            inputToken: 'ghp_validtoken',
            setInputToken: jest.fn(),
            isValidating: true,
            validationError: null,
            handleSave: jest.fn(),
        });

        render(<Settings onClose={mockOnClose} />);
        
        expect(screen.getByText('Validating...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /validating/i })).toBeDisabled();
    });

    it('calls handleSave when form is submitted', async () => {
        const mockHandleSave = jest.fn();
        (useGitHubTokenValidation as jest.Mock).mockReturnValue({
            inputToken: 'ghp_validtoken',
            setInputToken: jest.fn(),
            isValidating: false,
            validationError: null,
            handleSave: mockHandleSave,
        });

        render(<Settings onClose={mockOnClose} />);
        
        const form = screen.getByRole('form');
        fireEvent.submit(form);
        
        expect(mockHandleSave).toHaveBeenCalled();
    });
});
