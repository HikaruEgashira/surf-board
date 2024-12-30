import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import { vi } from 'vitest';

// Mock Sentry
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
}));

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  const originalConsoleError = console.error;
  beforeAll(() => {
    // Suppress console.error for cleaner test output
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error fallback when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByText('申し訳ありませんが、問題が発生しました。')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('provides a reload button that refreshes the page', () => {
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('ページを再読み込み');
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});