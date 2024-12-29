import React, { createContext, useContext } from 'react';
import { useTheme } from './ThemeContext';
import type { SyntaxTheme } from '../types';

interface SyntaxThemeContextType {
  syntaxTheme: SyntaxTheme;
  setSyntaxTheme: (theme: SyntaxTheme) => void;
  effectiveSyntaxTheme: 'light' | 'dark';
}

const SyntaxThemeContext = createContext<SyntaxThemeContextType | undefined>(undefined);

export function SyntaxThemeProvider({ children }: { children: React.ReactNode }) {
  const { effectiveTheme } = useTheme();
  const [syntaxTheme, setSyntaxTheme] = React.useState<SyntaxTheme>(() => {
    const saved = localStorage.getItem('syntax-theme') as SyntaxTheme;
    return saved || 'auto';
  });

  React.useEffect(() => {
    localStorage.setItem('syntax-theme', syntaxTheme);
  }, [syntaxTheme]);

  const effectiveSyntaxTheme = syntaxTheme === 'auto' ? effectiveTheme : syntaxTheme;

  React.useEffect(() => {
    document.documentElement.setAttribute('data-syntax-theme', effectiveSyntaxTheme);
  }, [effectiveSyntaxTheme]);

  return (
    <SyntaxThemeContext.Provider value={{
      syntaxTheme,
      setSyntaxTheme,
      effectiveSyntaxTheme
    }}>
      {children}
    </SyntaxThemeContext.Provider>
  );
}

export function useSyntaxTheme() {
  const context = useContext(SyntaxThemeContext);
  if (!context) {
    throw new Error('useSyntaxTheme must be used within SyntaxThemeProvider');
  }
  return context;
}
