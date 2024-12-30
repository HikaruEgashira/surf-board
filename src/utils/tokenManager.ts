import type { TokenManager } from '../types/api';

export class GitHubTokenManager implements TokenManager {
  private token: string | null = null;
  private expiresAt: number | null = null;
  private readonly storageKey = 'github_token';
  private readonly tokenValidityDuration = 12 * 60 * 60 * 1000; // 12 hours

  constructor() {
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const { token, expiresAt } = JSON.parse(storedData);
        this.token = token;
        this.expiresAt = expiresAt;
      }
    } catch (error) {
      console.error('Failed to load token from storage:', error);
      this.clearToken();
    }
  }

  private saveTokenToStorage(): void {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          token: this.token,
          expiresAt: this.expiresAt,
        })
      );
    } catch (error) {
      console.error('Failed to save token to storage:', error);
    }
  }

  private clearToken(): void {
    this.token = null;
    this.expiresAt = null;
    localStorage.removeItem(this.storageKey);
  }

  async getToken(): Promise<string> {
    if (!this.token) {
      throw new Error('No valid token available');
    }
    if (this.isTokenExpired()) {
      await this.refreshToken();
    }
    return this.token;
  }

  async refreshToken(): Promise<void> {
    // In a real implementation, this would make a request to refresh the token
    // For now, we'll just validate the current token
    if (!this.token) {
      throw new Error('No valid token available');
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      // Update token expiration
      this.expiresAt = Date.now() + this.tokenValidityDuration;
      this.saveTokenToStorage();
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  isTokenExpired(): boolean {
    return !this.token || !this.expiresAt || Date.now() >= this.expiresAt;
  }

  async revokeToken(): Promise<void> {
    if (!this.token) {
      return;
    }

    try {
      // In a real implementation, make a request to revoke the token
      // For GitHub, this would typically be done through the OAuth applications page
      this.clearToken();
    } catch (error) {
      console.error('Failed to revoke token:', error);
      throw error;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      this.token = token;
      this.expiresAt = Date.now() + this.tokenValidityDuration;
      this.saveTokenToStorage();
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }
}
