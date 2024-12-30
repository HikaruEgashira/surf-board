import type { SearchQuery, ValidationResult } from '../types/api';

export const validateSearchQuery = (query: SearchQuery): ValidationResult => {
  const errors: string[] = [];

  // Validate query string
  if (!query.query.trim()) {
    errors.push('検索クエリは必須です');
  }

  if (query.query.length > 256) {
    errors.push('検索クエリは256文字以内である必要があります');
  }

  // XSS対策
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(query.query)) {
    errors.push('不正な文字列が含まれています');
  }

  // Validate filters
  if (query.filters) {
    if (query.filters.language && !/^[a-zA-Z0-9+#.-]+$/.test(query.filters.language)) {
      errors.push('言語フィルターに不正な文字が含まれています');
    }

    if (query.filters.owner && !/^[a-zA-Z0-9-]+$/.test(query.filters.owner)) {
      errors.push('オーナーフィルターに不正な文字が含まれています');
    }

    if (query.filters.repo && !/^[a-zA-Z0-9-_.]+$/.test(query.filters.repo)) {
      errors.push('リポジトリフィルターに不正な文字が含まれています');
    }
  }

  // Validate page number
  if (query.page !== undefined && (!Number.isInteger(query.page) || query.page < 1)) {
    errors.push('ページ番号は1以上の整数である必要があります');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateGitHubToken = (token: string): ValidationResult => {
  const errors: string[] = [];

  if (!token) {
    errors.push('GitHubトークンは必須です');
    return { isValid: false, errors };
  }

  // GitHub token format validation
  const tokenPattern = /^gh[ops]_[a-zA-Z0-9]{36,251}$/;
  if (!tokenPattern.test(token)) {
    errors.push('トークンの形式が不正です。"gho_", "ghp_", "ghs_"で始まる必要があります');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};