import { createContext, useContext, useState, useEffect } from 'react';

interface GitHubTokenContextType {
    token: string | null;
    setToken: (token: string | null) => void;
}

const GitHubTokenContext = createContext<GitHubTokenContextType | undefined>(undefined);

export function GitHubTokenProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        // 環境変数からトークンを取得
        const envToken = import.meta.env.VITE_GITHUB_TOKEN;
        if (envToken) {
            return envToken;
        }
        // 環境変数が存在しない場合はローカルストレージから取得
        const savedToken = localStorage.getItem('github_token');
        return savedToken;
    });

    useEffect(() => {
        // トークンが変更されたらローカルストレージに保存
        if (token) {
            localStorage.setItem('github_token', token);
        } else {
            localStorage.removeItem('github_token');
        }
    }, [token]);

    return (
        <GitHubTokenContext.Provider value={{ token, setToken }}>
            {children}
        </GitHubTokenContext.Provider>
    );
}

export function useGitHubToken() {
    const context = useContext(GitHubTokenContext);
    if (context === undefined) {
        throw new Error('useGitHubToken must be used within a GitHubTokenProvider');
    }
    return context;
}
