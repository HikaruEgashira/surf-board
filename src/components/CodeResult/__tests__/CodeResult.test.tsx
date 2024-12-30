import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import CodeResult from '../CodeResult';
import { ThemeProvider } from '../../../context/ThemeContext';

const mockResult = {
  sha: '123',
  path: 'test/path',
  html_url: 'https://github.com/test',
  repository: {
    full_name: 'test/repo'
  },
  text_matches: [
    {
      fragment: 'test code'
    }
  ]
};

describe('CodeResult', () => {
  test('should render without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <CodeResult result={mockResult} />
      </ThemeProvider>
    );
    expect(container).toBeTruthy();
  });

  test('should memoize correctly with same props', () => {
    const { rerender, container: firstRender } = render(
      <ThemeProvider>
        <CodeResult result={mockResult} />
      </ThemeProvider>
    );

    const firstHTML = firstRender.innerHTML;

    rerender(
      <ThemeProvider>
        <CodeResult result={{...mockResult}} />
      </ThemeProvider>
    );

    expect(firstRender.innerHTML).toBe(firstHTML);
  });

  test('should re-render with different props', () => {
    const { rerender, container: firstRender } = render(
      <ThemeProvider>
        <CodeResult result={mockResult} />
      </ThemeProvider>
    );

    const firstHTML = firstRender.innerHTML;

    const newResult = {
      ...mockResult,
      sha: '456'
    };

    rerender(
      <ThemeProvider>
        <CodeResult result={newResult} />
      </ThemeProvider>
    );

    expect(firstRender.innerHTML).not.toBe(firstHTML);
  });
});