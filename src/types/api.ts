export interface GitHubErrorResponse {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    code: string;
    message: string;
    resource: string;
    field: string;
  }>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  page?: number;
}

export interface SearchFilters {
  language?: string;
  owner?: string;
  repo?: string;
}

export interface TokenManager {
  getToken(): Promise<string>;
  refreshToken(): Promise<void>;
  isTokenExpired(): boolean;
  revokeToken(): Promise<void>;
}