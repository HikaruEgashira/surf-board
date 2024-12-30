import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import SearchResults from '../SearchResults';
import { SearchContext } from '../../../context/SearchContext';

const mockResults = Array(10).fill(null).map((_, i) => ({
  sha: `sha${i}`,
  path: `path${i}`,
  html_url: `https://github.com/test${i}`,
  repository: {
    full_name: `test/repo${i}`
  },
  text_matches: [{
    fragment: `test code ${i}`
  }]
}));

const mockContextValue = {
  results: mockResults,
  isLoading: false,
  hasMore: true,
  loadMore: vi.fn(),
  pullDistance: 0,
  handleTouchStart: vi.fn(),
  handleTouchMove: vi.fn(),
  handleTouchEnd: vi.fn(),
  bottomRef: { current: null },
  containerRef: { current: null }
};

describe('SearchResults', () => {
  test('should render virtualized list', () => {
    const { container } = render(
      <SearchContext.Provider value={mockContextValue}>
        <SearchResults />
      </SearchContext.Provider>
    );
    
    expect(container.querySelector('[data-virtuoso-scroller]')).toBeTruthy();
  });

  test('should render nothing when no results and not loading', () => {
    const { container } = render(
      <SearchContext.Provider value={{
        ...mockContextValue,
        results: [],
        isLoading: false
      }}>
        <SearchResults />
      </SearchContext.Provider>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('should show loading skeletons', () => {
    const { container } = render(
      <SearchContext.Provider value={{
        ...mockContextValue,
        isLoading: true
      }}>
        <SearchResults />
      </SearchContext.Provider>
    );
    
    expect(container.querySelector('[data-testid="skeleton"]')).toBeTruthy();
  });
});