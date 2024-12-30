export interface AppConfig {
  api: {
    github: {
      perPage: number;
      maxItems: number;
      maxRetries: number;
      retryDelay: number;
      maxStoredResults: number;
    };
    cache: {
      duration: number;
    };
  };
  search: {
    debounceDelay: number;
    minQueryLength: number;
  };
}

export const config: AppConfig = {
  api: {
    github: {
      perPage: Number(process.env.NEXT_PUBLIC_GITHUB_PER_PAGE) || 30,
      maxItems: Number(process.env.NEXT_PUBLIC_GITHUB_MAX_ITEMS) || 1000,
      maxRetries: Number(process.env.NEXT_PUBLIC_GITHUB_MAX_RETRIES) || 3,
      retryDelay: Number(process.env.NEXT_PUBLIC_GITHUB_RETRY_DELAY) || 1000,
      maxStoredResults: Number(process.env.NEXT_PUBLIC_MAX_STORED_RESULTS) || 300
    },
    cache: {
      duration: Number(process.env.NEXT_PUBLIC_CACHE_DURATION) || 5 * 60 * 1000
    }
  },
  search: {
    debounceDelay: Number(process.env.NEXT_PUBLIC_DEBOUNCE_DELAY) || 1000,
    minQueryLength: Number(process.env.NEXT_PUBLIC_MIN_QUERY_LENGTH) || 3
  }
};