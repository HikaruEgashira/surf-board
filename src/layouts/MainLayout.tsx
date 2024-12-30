import { useCallback } from 'react';
import { useSearchContext } from '../context/SearchContext';
import { useNavigate } from '../hooks/useNavigate';
import Toast from '../components/Toast';

interface MainLayoutProps {
    children: React.ReactNode;
    error: string | null;
}

export default function MainLayout({ children, error }: MainLayoutProps) {
    const { clearError } = useSearchContext();
    const { navigateToSettings } = useNavigate();

    const handleSettingsAction = useCallback(() => {
        // If error is related to GitHub token, navigate to settings
        if (error?.toLowerCase().includes('github') || error?.toLowerCase().includes('token')) {
            navigateToSettings();
            clearError();
        }
    }, [error, navigateToSettings, clearError]);

    const getErrorAction = useCallback(() => {
        if (error?.toLowerCase().includes('github') || error?.toLowerCase().includes('token')) {
            return {
                label: 'Go to Settings',
                onClick: handleSettingsAction
            };
        }
        return undefined;
    }, [error, handleSettingsAction]);

    return (
        <main className="min-h-screen flex items-center">
            <div className="w-full container mx-auto px-4">
                {error && (
                    <Toast
                        message={error}
                        onClose={clearError}
                        action={getErrorAction()}
                    />
                )}
                {children}
            </div>
        </main>
    );
}
