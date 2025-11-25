'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Global query ayarları
            staleTime: 5 * 60 * 1000, // 5 dakika
            gcTime: 10 * 60 * 1000, // 10 dakika (eski adı: cacheTime)
            retry: (failureCount, error: unknown) => {
              // Auth hatalarında retry yapma
              if (error && typeof error === 'object' && 'status' in error) {
                const status = (error as { status: number }).status;
                if (status === 401 || status === 403) {
                  return false;
                }
              }
              // Diğer hatalarda maksimum 3 kez dene
              return failureCount < 3;
            },
            refetchOnWindowFocus: false, // Pencere odaklandığında otomatik refetch yapma
          },
          mutations: {
            // Global mutation ayarları
            retry: 1, // Mutation hatalarında 1 kez dene
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 