import React from 'react';
import * as Sentry from '@sentry/react';

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-red-600">エラーが発生しました</h2>
        <p className="mb-4 text-gray-600">申し訳ありませんが、問題が発生しました。</p>
        <p className="text-sm text-gray-500">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          ページを再読み込み
        </button>
      </div>
    </div>
  );
};

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      extra: {
        errorInfo,
        location: window.location.href,
        timestamp: new Date().toISOString(),
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error!} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;