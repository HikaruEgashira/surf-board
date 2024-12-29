import React, { forwardRef } from 'react';
import type { TextMatch } from '../../types';

interface CodeSnippetProps {
  match: TextMatch;
}

export const CodeSnippet = forwardRef<HTMLElement, CodeSnippetProps>(
  function CodeSnippet({ match }, ref) {
    return (
      <div className="font-mono text-sm overflow-x-auto px-3">
        <pre className="text-nord-0 dark:text-nord-6">
          <code ref={ref} className="language-typescript" />
        </pre>
      </div>
    );
  }
);