import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    reload: vi.fn(),
  },
  writable: true,
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'test-user-agent',
  },
  writable: true,
});