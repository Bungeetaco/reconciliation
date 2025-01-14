// ErrorFallback.tsx
interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
  }
  
  export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">{error.message}</p>
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }