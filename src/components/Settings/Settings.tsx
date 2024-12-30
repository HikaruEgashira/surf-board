import { motion } from 'framer-motion';
import { X, Moon, Sun } from 'lucide-react';
import { useGitHubToken } from '../../context/GitHubTokenContext';
import { useSearchSettings } from '../../context/SearchSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { useGitHubTokenValidation } from '../../hooks/useGitHubTokenValidation';

export function Settings({ onClose }: { onClose: () => void }) {
    const { token, setToken } = useGitHubToken();
    const { excludeNonProgramming, setExcludeNonProgramming } = useSearchSettings();
    const { theme, setTheme } = useTheme();

    const {
        inputToken,
        setInputToken,
        isValidating,
        validationError,
        handleSave,
    } = useGitHubTokenValidation({
        initialToken: token || '',
        onSave: setToken,
        onClose,
    });

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
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                                role="form"
                                aria-label="GitHub Token Settings"
                            >
                                <input
                                    type="text"
                                    id="github-username"
                                    autoComplete="username"
                                    aria-hidden="true"
                                    tabIndex={-1}
                                    style={{ display: 'none' }}
                                    value="github-token"
                                    readOnly
                                />
                                <input
                                    aria-label="GitHub Personal Access Token"
                                    id="github-token"
                                    type="password"
                                    value={inputToken}
                                    onChange={(e) => {
                                        const value = e.target.value.trim();
                                        setInputToken(value);
                                    }}
                                    placeholder="Enter your GitHub token"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                             shadow-sm placeholder-gray-400
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    pattern="^gh[ps]_[a-zA-Z0-9]{36,251}$"
                                    title="Please enter a valid GitHub token starting with 'ghp_' or 'ghs_'"
                                    autoComplete="new-password"
                                    spellCheck="false"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    data-lpignore="true"
                                />
                                <div className="mt-2 space-y-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        A GitHub personal access token is required to enable code search.
                                    </p>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        To get a token:
                                        <ol className="list-decimal list-inside mt-1 space-y-1">
                                            <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">GitHub Token Settings</a></li>
                                            <li>Click "Generate new token (classic)"</li>
                                            <li>Select the following scopes:
                                                <ul className="list-disc list-inside ml-4 mt-1">
                                                    <li>repo (for private repos)</li>
                                                    <li>read:packages</li>
                                                    <li>read:org</li>
                                                </ul>
                                            </li>
                                            <li>Generate and copy the token</li>
                                        </ol>
                                    </div>
                                </div>
                            </form>
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

                        {validationError && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
                            </div>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={isValidating}
                            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md
                                ${isValidating
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                }
                                transition-colors duration-200 ease-in-out
                                flex items-center justify-center space-x-2`}
                        >
                            {isValidating ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Validating...</span>
                                </>
                            ) : (
                                <span>Save</span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
