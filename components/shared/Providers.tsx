'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { handleApiError } from '@/lib/error-handler';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error) => handleApiError(error, 'Mutation Error'),
          },
          queries: {
            retry: 3, // Retry failed queries 3 times
            staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
            refetchOnWindowFocus: true, // Refetch when window regains focus
          }
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
