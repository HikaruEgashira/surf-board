import type { ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { GitHubTokenProvider } from '../context/GitHubTokenContext';

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <ThemeProvider>
            <GitHubTokenProvider>
                <div className="flex flex-col bg-gradient-to-b from-white via-white/[.999] to-white/[.997]
                        dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900/90">
                    {children}
                </div>
            </GitHubTokenProvider>
        </ThemeProvider>
    );
}
