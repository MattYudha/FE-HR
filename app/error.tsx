'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <head>
        <title>Something went wrong!</title>
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-red-800">Something went wrong!</h1>
          <p className="mb-8 text-lg text-red-700">
            We encountered an unexpected error. Please try again later.
          </p>
          <button
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </button>
          <pre className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-800 text-left">
            {error.message}
          </pre>
        </div>
      </body>
    </html>
  );
}
