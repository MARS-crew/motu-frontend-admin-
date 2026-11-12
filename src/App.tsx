import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/queries/queryClient';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className="p-6 text-display-lg font-bold text-motu-black">모투 관리자</h1>
    </QueryClientProvider>
  );
}
