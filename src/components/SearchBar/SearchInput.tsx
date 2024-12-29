import { useEffect, useRef, useCallback, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Search, XCircle } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  onBlur,
  onClear,
  placeholder = 'Search code...',
  className = '',
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleBlur = useCallback(() => {
    if (value.trim() === '') {
      onChange('');
    }
    onBlur?.();
  }, [value, onChange, onBlur]);

  // 入力値の変更を即座に通知
  const handleChange = (newValue: string) => {
    onChange(newValue);
    onSubmit();
  };

  // スラッシュキーでの検索フォーカス
  useEffect(() => {
    const handleSlashKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleSlashKey);
    return () => window.removeEventListener('keydown', handleSlashKey);
  }, []);

  return (
    <div className={`relative flex-1 mx-auto group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="block w-full pl-9 pr-16 py-2 bg-white dark:bg-gray-800/95
                  border border-gray-300 dark:border-gray-700 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                  placeholder-gray-500 dark:placeholder-gray-500
                  text-gray-900 dark:text-gray-100
                  shadow-sm hover:border-gray-400 dark:hover:border-600
                  transition-colors duration-150"
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => {
            onClear?.();
          }}
          className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
      <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-normal
                     text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800
                     border border-gray-200/70 dark:border-gray-700/50 rounded-[3px]">
        /
      </kbd>
    </div>
  );
}
