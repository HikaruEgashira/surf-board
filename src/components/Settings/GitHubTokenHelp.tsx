import { ExternalLink } from 'lucide-react';

export function GitHubTokenHelp() {
    return (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
                To get a GitHub token:
                <a
                    href="https://github.com/settings/tokens/new?description=Code%20Search%20App&scopes=repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                >
                    Create a Personal Access Token
                    <ExternalLink className="w-3 h-3 ml-1" />
                </a>
            </p>
            <div className="pl-4">
                <p className="font-medium mb-1">Required scopes:</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li>repo (for private repositories)</li>
                    <li>public_repo (for public repositories only)</li>
                </ul>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
                Note: Token should start with 'gho_', 'ghp_', or 'ghs_'
            </p>
        </div>
    );
}