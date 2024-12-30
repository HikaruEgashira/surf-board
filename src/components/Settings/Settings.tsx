import { motion } from 'framer-motion';
import { X, Moon, Sun, AlertCircle } from 'lucide-react';
import { useGitHubToken } from '../../context/GitHubTokenContext';
import { useSearchSettings } from '../../context/SearchSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { useGitHubTokenValidation } from '../../hooks/useGitHubTokenValidation';
import { GitHubTokenHelp } from './GitHubTokenHelp';

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
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="github-token"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    GitHub Token
                                </label>
                                {validationError && (
                                    <div className="flex items-center text-red-600 dark:text-red-400">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        <span className="text-xs">Invalid token</span>
                                    </div>
                                )}
                            </div>
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                                role="form"
                                aria-label="GitHub Token Settings"
                                className="space-y-2"
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
                                <div className="relative">
                                    <input
                                        aria-label="GitHub Personal Access Token"
                                        id="github-token"
                                        type="password"
                                        value={inputToken}
                                        onChange={(e) => {
                                            const value = e.target.value.trim();
                                            setInputToken(value);
                                        }}
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm 
                                            placeholder-gray-400 bg-white dark:bg-gray-700 
                                            text-gray-900 dark:text-gray-100
                                            focus:outline-none focus:ring-2 focus:border-transparent
                                            ${validationError 
                                                ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                            }`}
                                        pattern="^gh[pso]_[a-zA-Z0-9]{36,251}$"
                                        title="Please enter a valid GitHub token starting with 'gho_' or 'ghp_' or 'ghs_'"
                                        autoComplete="new-password"
                                        spellCheck="false"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        data-lpignore="true"
                                    />
                                </div>
                                <GitHubTokenHelp />
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
                                Theme
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
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Token Validation Failed</p>
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationError}</p>
                                </div>
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
