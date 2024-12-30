import { useCallback } from 'react';

export function useNavigate() {
    const navigateToSettings = useCallback(() => {
        // For now, we'll just open the settings dialog
        // In the future, this could be updated to use proper routing
        const settingsButton = document.querySelector('[aria-label="Settings"]') as HTMLButtonElement;
        if (settingsButton) {
            settingsButton.click();
        }
    }, []);

    return {
        navigateToSettings,
    };
}