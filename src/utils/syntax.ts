import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import '../styles/nord-prism.css';

const LANGUAGE_PATTERNS = {
  typescript: /\.(ts|tsx)$|interface|type\s+\w+|import\s+.*\s+from/,
  javascript: /\.(js|jsx)$|const\s+\w+\s*=|function\s+\w+\s*\(|=>/,
  jsx: /React|render\s*\(|<\w+\s*.*>/,
  tsx: /React.*TypeScript|<\w+\s*.*>.*:\s*\w+/,
} as const;

export function highlightCode(element: HTMLElement, code: string, path?: string) {
  const language = detectLanguage(code, path);
  element.textContent = code;
  element.className = `language-${language}`;
  Prism.highlightElement(element);
}

function detectLanguage(code: string, path?: string): string {
  if (path) {
    const ext = path.split('.').pop()?.toLowerCase();
    if (ext === 'ts' || ext === 'tsx') return 'typescript';
    if (ext === 'js' || ext === 'jsx') return 'javascript';
  }

  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(code)) return lang;
  }

  return 'typescript';
}