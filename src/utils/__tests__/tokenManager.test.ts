import { GitHubTokenManager } from '../tokenManager';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('GitHubTokenManager', () => {
  let tokenManager: GitHubTokenManager;
  const validToken = 'gho_1234567890abcdef1234567890abcdef12345678';

  beforeEach(() => {
    localStorageMock.clear();
    tokenManager = new GitHubTokenManager();
    global.fetch = jest.fn();
  });

  it('should initialize with no token', async () => {
    expect(tokenManager.isTokenExpired()).toBe(true);
    await expect(tokenManager.getToken()).rejects.toThrow('No valid token available');
  });

  it('should set and get token', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ login: 'testuser' })
    });

    await tokenManager.setToken(validToken);
    expect(tokenManager.isTokenExpired()).toBe(false);
    
    const token = await tokenManager.getToken();
    expect(token).toBe(validToken);
  });

  it('should persist token to localStorage', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ login: 'testuser' })
    });

    await tokenManager.setToken(validToken);
    
    // Create new instance to test persistence
    const newTokenManager = new GitHubTokenManager();
    expect(newTokenManager.isTokenExpired()).toBe(false);
    const token = await newTokenManager.getToken();
    expect(token).toBe(validToken);
  });

  it('should handle token expiration', async () => {
    // Mock successful API response for initial set
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ login: 'testuser' })
    });

    const now = Date.now();
    const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);

    await tokenManager.setToken(validToken);
    
    // Force token expiration by moving time forward
    dateSpy.mockImplementation(() => now + (13 * 60 * 60 * 1000)); // 13 hours later

    expect(tokenManager.isTokenExpired()).toBe(true);
    
    dateSpy.mockRestore();
  });

  it('should revoke token', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ login: 'testuser' })
    });

    await tokenManager.setToken(validToken);
    await tokenManager.revokeToken();
    
    expect(tokenManager.isTokenExpired()).toBe(true);
    await expect(tokenManager.getToken()).rejects.toThrow('No valid token available');
  });

  it('should handle failed token validation', async () => {
    // Mock failed API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Bad credentials' })
    });

    await expect(tokenManager.setToken(validToken)).rejects.toThrow();
    expect(tokenManager.isTokenExpired()).toBe(true);
  });
});
