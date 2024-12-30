import React, { createContext, useContext } from 'react';

interface SearchSettingsContextType {
  excludeNonProgramming: boolean;
  setExcludeNonProgramming: (value: boolean) => void;
}

const SearchSettingsContext = createContext<SearchSettingsContextType>({
  excludeNonProgramming: false,
  setExcludeNonProgramming: () => {},
});

export const useSearchSettings = () => useContext(SearchSettingsContext);

export const SearchSettingsProvider: React.FC<{
  children: React.ReactNode;
  initialExcludeNonProgramming?: boolean;
}> = ({ children, initialExcludeNonProgramming = false }) => {
  const [excludeNonProgramming, setExcludeNonProgramming] = React.useState(initialExcludeNonProgramming);

  return (
    <SearchSettingsContext.Provider value={{ excludeNonProgramming, setExcludeNonProgramming }}>
      {children}
    </SearchSettingsContext.Provider>
  );
};