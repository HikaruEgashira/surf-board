export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class SearchError extends AppError {
  constructor(
    message: string,
    code: string,
    context: Record<string, unknown>
  ) {
    super(message, code, context);
    this.name = 'SearchError';
  }
}

export interface ErrorContext {
  timestamp: string;
  url: string;
  userAgent: string;
  query?: string;
  page?: number;
  errorCode: string;
  stackTrace?: string;
}

export function captureErrorContext(error: Error): ErrorContext {
  return {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    errorCode: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
    stackTrace: error.stack,
  };
}