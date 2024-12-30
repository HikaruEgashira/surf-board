import { renderHook, act } from '@testing-library/react';
import { useSearchHistory } from '../useSearchHistory';

describe('useSearchHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add and retrieve search history', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('react hooks');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].query).toBe('react hooks');
  });

  it('should remove items from history', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('react hooks');
      result.current.addToHistory('typescript');
    });

    act(() => {
      result.current.removeFromHistory('react hooks');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].query).toBe('typescript');
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('react hooks');
      result.current.addToHistory('typescript');
    });

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toHaveLength(0);
  });

  it('should get popular queries', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('react hooks');
      result.current.addToHistory('typescript');
      result.current.addToHistory('react hooks'); // Added twice
    });

    const popularQueries = result.current.getPopularQueries();
    expect(popularQueries[0]).toBe('react hooks');
  });
});