import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

// Mock GitHub API responses
const handlers = [
  http.get('https://api.github.com/search/code', async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const page = parseInt(url.searchParams.get('page') || '1');
    const auth = request.headers.get('Authorization');

    // Check for token
    if (!auth || !auth.startsWith('Bearer ')) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Mock rate limit error
    if (query?.includes('rate-limit-test')) {
      return new HttpResponse(
        JSON.stringify({ message: 'API rate limit exceeded' }),
        {
          status: 403,
          headers: {
            'x-ratelimit-remaining': '0',
            'x-ratelimit-reset': Math.floor((Date.now() + 3600000) / 1000).toString(),
          },
        }
      );
    }

    // Mock network error
    if (query?.includes('network-error-test')) {
      return HttpResponse.error();
    }

    // Mock successful response
    const items = Array.from({ length: 100 }, (_, i) => ({
      name: `file${i}.ts`,
      path: `src/file${i}.ts`,
      repository: { full_name: 'test/repo' },
      sha: `sha${i}`,
      text_matches: [{
        object_url: `https://api.github.com/repositories/1/contents/src/file${i}.ts`,
        object_type: 'file',
        property: 'content',
        fragment: 'const test = "test";',
      }],
    }));

    const start = (page - 1) * 30;
    const end = page * 30;

    return HttpResponse.json({
      total_count: 100,
      incomplete_results: false,
      items: items.slice(start, end),
    });
  }),
];

const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Close server after all tests
afterAll(() => {
  server.close();
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});
