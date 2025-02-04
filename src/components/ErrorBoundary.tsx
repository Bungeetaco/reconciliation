import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    console.error('Uncaught error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-red-50 text-red-600 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <div className="mb-4">
            <p className="font-semibold mb-2">Error:</p>
            <p className="text-sm bg-white p-2 rounded">{this.state.error?.message}</p>
          </div>
          {this.state.errorInfo && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Component Stack:</p>
              <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
