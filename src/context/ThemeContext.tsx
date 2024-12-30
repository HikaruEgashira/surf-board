import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'nord-dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;

    if (theme === 'nord-dark') {
      root.classList.add('dark', 'nord-theme');
      root.setAttribute('data-syntax-theme', 'dark');
    } else {
      root.classList.remove('dark', 'nord-theme');
      root.setAttribute('data-syntax-theme', 'light');
    }
  }, [theme]);

  const effectiveTheme = theme === 'nord-dark' ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
