import { FileCode, Star, GitFork } from 'lucide-react';
import type { Repository } from '../../types';

interface CodeHeaderProps {
  repository?: Repository;
  path: string;
}

export function CodeHeader({ repository, path }: CodeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 px-3">
      <div className="flex items-center gap-2 min-w-0">
        <FileCode className="w-4 h-4 text-nord-9 dark:text-nord-8 flex-shrink-0" />
        <a
          href={repository?.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-nord-10 dark:text-nord-8 hover:underline truncate"
        >
          {repository?.full_name}
        </a>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-nord-3 dark:text-nord-4 hover:text-nord-1 dark:hover:text-nord-5 truncate max-w-[200px]"
        >
          {path}
        </a>
        <div className="flex items-center gap-3 text-xs text-nord-3 dark:text-nord-4">
          {repository?.stargazers_count !== undefined && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {repository.stargazers_count.toLocaleString()}
            </span>
          )}
          {repository?.forks_count !== undefined && (
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              {repository.forks_count.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
