export type Theme = 'light' | 'dark' | 'system';
export type SyntaxTheme = 'light' | 'dark' | 'auto';

export interface TextMatch {
  fragment: string;
  matches: Array<{ indices: [number, number] }>;
}

export interface Repository {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface CodeSearchResult {
  sha: string;
  path: string;
  html_url: string;
  repository?: Repository;
  text_matches?: TextMatch[];
}

export interface SearchResponse {
  total_count: number;
  items: CodeSearchResult[];
}
