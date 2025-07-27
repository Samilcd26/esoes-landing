'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
            retry: (failureCount, error: any) => {
              // Auth hatalarında retry yapma
              if (error?.status === 401 || error?.status === 403) {
                return false;
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
      {/* Development ortamında React Query DevTools'u göster */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
} 