import { validateSearchQuery, validateGitHubToken } from '../validation';

describe('validateSearchQuery', () => {
  it('should validate a valid search query', () => {
    const result = validateSearchQuery({
      query: 'test query',
      page: 1
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject empty queries', () => {
    const result = validateSearchQuery({
      query: '',
      page: 1
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('検索クエリは必須です');
  });

  it('should reject queries longer than 256 characters', () => {
    const longQuery = 'a'.repeat(257);
    const result = validateSearchQuery({
      query: longQuery,
      page: 1
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('検索クエリは256文字以内である必要があります');
  });

  it('should reject queries containing script tags', () => {
    const result = validateSearchQuery({
      query: 'test <script>alert("xss")</script>',
      page: 1
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('不正な文字列が含まれています');
  });

  it('should validate filters correctly', () => {
    const result = validateSearchQuery({
      query: 'test',
      filters: {
        language: 'typescript',
        owner: 'test-owner',
        repo: 'test-repo'
      },
      page: 1
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid filter values', () => {
    const result = validateSearchQuery({
      query: 'test',
      filters: {
        language: 'type<script>',
        owner: 'test/owner',
        repo: 'test/repo'
      },
      page: 1
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('言語フィルターに不正な文字が含まれています');
    expect(result.errors).toContain('オーナーフィルターに不正な文字が含まれています');
    expect(result.errors).toContain('リポジトリフィルターに不正な文字が含まれています');
  });
});

describe('validateGitHubToken', () => {
  it('should validate a valid GitHub token', () => {
    const result = validateGitHubToken('gho_1234567890abcdef1234567890abcdef12345678');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject empty tokens', () => {
    const result = validateGitHubToken('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('GitHubトークンは必須です');
  });

  it('should reject tokens with invalid format', () => {
    const result = validateGitHubToken('invalid_token');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('トークンの形式が不正です。"gho_", "ghp_", "ghs_"で始まる必要があります');
  });

  it('should validate different token types', () => {
    const tokens = [
      'gho_1234567890abcdef1234567890abcdef12345678',
      'ghp_1234567890abcdef1234567890abcdef12345678',
      'ghs_1234567890abcdef1234567890abcdef12345678'
    ];

    tokens.forEach(token => {
      const result = validateGitHubToken(token);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});