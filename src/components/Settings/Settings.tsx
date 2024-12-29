import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Moon, Sun } from 'lucide-react';
import { useGitHubToken } from '../../context/GitHubTokenContext';
import { useSearchSettings } from '../../context/SearchSettingsContext';
import { useTheme } from '../../context/ThemeContext';

export function Settings({ onClose }: { onClose: () => void }) {
    const { token, setToken } = useGitHubToken();
    const { excludeNonProgramming, setExcludeNonProgramming } = useSearchSettings();
    const { theme, setTheme } = useTheme();
    const [inputToken, setInputToken] = useState(token || '');

    const handleSave = () => {
        setToken(inputToken || null);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Navigation Panel */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-800 shadow-lg z-50"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="github-token"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                GitHub Token
                            </label>
                            <input
                                id="github-token"
                                type="password"
                                value={inputToken}
                                onChange={(e) => setInputToken(e.target.value)}
                                placeholder="Enter your GitHub token"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                         shadow-sm placeholder-gray-400
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Provide your GitHub personal access token to enable code search.
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="exclude-non-programming"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Exclude non-programming languages
                            </label>
                            <button
                                id="exclude-non-programming"
                                onClick={() => setExcludeNonProgramming(!excludeNonProgramming)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                    ${excludeNonProgramming ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                        ${excludeNonProgramming ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="theme-toggle"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Nord Dark Theme
                            </label>
                            <button
                                id="theme-toggle"
                                onClick={() => setTheme(theme === 'light' ? 'nord-dark' : 'light')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                    ${theme === 'nord-dark' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                        ${theme === 'nord-dark' ? 'translate-x-6' : 'translate-x-1'}`}
                                >
                                    {theme === 'nord-dark' ? (
                                        <Moon className="w-3 h-3 text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                    ) : (
                                        <Sun className="w-3 h-3 text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                    )}
                                </span>
                            </button>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600
                                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                     focus:ring-blue-500 rounded-md"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
