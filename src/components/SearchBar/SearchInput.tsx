import { useEffect, useRef, useCallback, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Search, XCircle } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  onBlur,
  placeholder = 'Search code...',
  className = '',
  debounceDelay = 500
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSearchRef = useRef<string>('');

  const handleSubmit = useCallback((force: boolean = false) => {
    const trimmedValue = value.trim();
    // 強制実行でない場合のみ、前回と同じ検索クエリをスキップ
    if (!force && trimmedValue === lastSearchRef.current) return;

    onSubmit();
    lastSearchRef.current = trimmedValue;
  }, [value, onSubmit]);

  const handleBlur = useCallback(() => {
    // 値が空の場合は初期状態に戻す
    if (value.trim() === '') {
      onChange('');
      lastSearchRef.current = '';
    }
    onBlur?.();
  }, [value, onChange, onBlur]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(true); // 強制実行
    }
  };

  // 入力値が変更された時のデバウンス処理
  useEffect(() => {
    // 前回のタイマーをクリア
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 空の入力値の場合は処理をスキップ
    const trimmedValue = value.trim();
    if (trimmedValue === '') return;

    // 3文字以上の場合のみ自動検索を実行
    if (trimmedValue.length >= 3) {
      // 新しいタイマーをセット
      debounceTimerRef.current = setTimeout(handleSubmit, debounceDelay);
    }

    // クリーンアップ関数
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, debounceDelay, handleSubmit]);

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
        onChange={(e) => onChange(e.target.value)}
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
            onChange('');
            handleBlur();
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
