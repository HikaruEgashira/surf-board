import React, { useState } from 'react';
import { Search, Github, Settings as SettingsIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Settings } from '../Settings/Settings';

export function HeroFeatures() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <Search className="w-4 h-4" />
          <span>Search code</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
        <a
          href="https://github.com/HikaruEgashira/surf-board"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>Powered by GitHub</span>
        </a>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={cn(
            'flex items-center gap-1.5 transition-colors',
            isSettingsOpen
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          )}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <div className="absolute top-12 right-0 w-80">
            <Settings onClose={() => setIsSettingsOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
