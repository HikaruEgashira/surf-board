import React, { createContext, useContext } from 'react';

interface GitHubTokenContextType {
  token: string | null;
  setToken: (token: string) => void;
}

const GitHubTokenContext = createContext<GitHubTokenContextType>({
  token: null,
  setToken: () => {},
});

export const useGitHubToken = () => useContext(GitHubTokenContext);

export const GitHubTokenProvider: React.FC<{
  children: React.ReactNode;
  initialToken?: string;
}> = ({ children, initialToken = null }) => {
  const [token, setToken] = React.useState<string | null>(initialToken);

  return (
    <GitHubTokenContext.Provider value={{ token, setToken }}>
      {children}
    </GitHubTokenContext.Provider>
  );
};