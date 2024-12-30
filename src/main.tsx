import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './styles/nord-theme.css';
import './index.css';

// Initialize Sentry
// Note: Replace SENTRY_DSN with your actual Sentry DSN in production
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
