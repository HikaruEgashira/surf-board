import * as Sentry from '@sentry/react';

export interface Logger {
  error(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
}

class ProductionLogger implements Logger {
  error(message: string, context?: Record<string, unknown>) {
    Sentry.captureException(new Error(message), {
      extra: context,
      level: 'error',
    });
    console.error(message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    Sentry.addBreadcrumb({
      category: 'info',
      message,
      data: context,
      level: 'info',
    });
    console.info(message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    Sentry.captureMessage(message, {
      level: 'warning',
      extra: context,
    });
    console.warn(message, context);
  }
}

class DevelopmentLogger implements Logger {
  error(message: string, context?: Record<string, unknown>) {
    console.error(message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    console.info(message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(message, context);
  }
}

export const logger: Logger = 
  import.meta.env.PROD ? new ProductionLogger() : new DevelopmentLogger();