import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';

import { useRestoreSession } from '@/hooks/useRestoreSession';
import { queryClient } from '@/queries/queryClient';
import { router } from '@/routes/router';

export function App() {
  useRestoreSession();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
