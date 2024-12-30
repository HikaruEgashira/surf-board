import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCodeSearch } from '../useCodeSearch';
import { GitHubTokenProvider } from '../../context/GitHubTokenContext';
import { SearchSettingsProvider } from '../../context/SearchSettingsContext';
import React from 'react';

// Increase the default timeout for async operations
vi.setConfig({ testTimeout: 10000 });

// Create context values
const mockGitHubContext = {
  token: 'test-token',
  setToken: vi.fn(),
};

const mockSearchSettingsContext = {
  excludeNonProgramming: false,
  setExcludeNonProgramming: vi.fn(),
};

// Mock the context hooks
vi.mock('../../context/GitHubTokenContext', () => ({
  useGitHubToken: () => mockGitHubContext,
}));

vi.mock('../../context/SearchSettingsContext', () => ({
  useSearchSettings: () => mockSearchSettingsContext,
}));

describe('useCodeSearch', () => {
  beforeEach(() => {
    // Clear all mocks and timers before each test
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should handle rate limit errors', async () => {
    const { result } = renderHook(() => useCodeSearch());

    await act(async () => {
      result.current.searchCode('rate-limit-test');
      await vi.runAllTimersAsync();
    });

    expect(result.current.error).toBe('API rate limit exceeded. Please wait 3600 seconds.');
  });

  it('should cache results correctly', async () => {
    const { result } = renderHook(() => useCodeSearch());

    // First search
    await act(async () => {
      result.current.searchCode('test-query');
      await vi.runAllTimersAsync();
    });

    expect(result.current.results).toHaveLength(30);
    const firstResults = result.current.results;

    // Second search with same query should use cache
    await act(async () => {
      result.current.searchCode('test-query');
      await vi.runAllTimersAsync();
    });

    expect(result.current.results).toBe(firstResults); // Same reference = from cache
  });

  it('should handle network errors with retry', async () => {
    const { result } = renderHook(() => useCodeSearch());

    await act(async () => {
      result.current.searchCode('network-error-test');
      // Run retries
      for (let i = 0; i <= 3; i++) {
        await vi.runAllTimersAsync();
      }
    });

    expect(result.current.error).toBeTruthy();
  });

  it('should debounce search requests', async () => {
    const { result } = renderHook(() => useCodeSearch({ debounceDelay: 500 }));

    await act(async () => {
      // Multiple rapid searches
      result.current.searchCode('test1');
      result.current.searchCode('test2');
      result.current.searchCode('test3');
      
      // Should not have results yet due to debounce
      expect(result.current.results).toHaveLength(0);

      // Wait for debounce
      await vi.advanceTimersByTimeAsync(500);
    });

    // Should only execute the last search
    expect(result.current.results).toHaveLength(30);
  });

  it('should handle pagination correctly', async () => {
    const { result } = renderHook(() => useCodeSearch());

    // First page
    await act(async () => {
      result.current.searchCode('test-query');
      await vi.runAllTimersAsync();
    });

    expect(result.current.results).toHaveLength(30);

    // Load second page
    await act(async () => {
      result.current.loadMore();
      await vi.runAllTimersAsync();
      // Need to wait for state updates
      await vi.runAllTimersAsync();
    });

    // Should have both pages
    expect(result.current.results).toHaveLength(60);
  });

  it('should filter non-programming files when enabled', async () => {
    // Update mock to filter non-programming files
    mockSearchSettingsContext.excludeNonProgramming = true;

    const { result } = renderHook(() => useCodeSearch());

    await act(async () => {
      result.current.searchCode('test-query');
      await vi.runAllTimersAsync();
    });

    expect(result.current.results.every(item => !item.path.endsWith('.md'))).toBe(true);

    // Reset mock
    mockSearchSettingsContext.excludeNonProgramming = false;
  });

  it('should handle empty and short queries correctly', async () => {
    const { result } = renderHook(() => useCodeSearch({ minQueryLength: 3 }));

    await act(async () => {
      result.current.searchCode('');
      await vi.runAllTimersAsync();
    });

    expect(result.current.results).toHaveLength(0);

    await act(async () => {
      result.current.searchCode('ab');
      await vi.runAllTimersAsync();
    });

    expect(result.current.results).toHaveLength(0);
  });

  it('should abort previous requests when new search is triggered', async () => {
    const { result } = renderHook(() => useCodeSearch());

    await act(async () => {
      result.current.searchCode('test1');
      // Immediately search again
      result.current.searchCode('test2');
      await vi.runAllTimersAsync();
    });

    expect(result.current.results.length).toBeGreaterThan(0);
    expect(result.current.isLoading).toBe(false);
  });
});
