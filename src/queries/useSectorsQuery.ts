import { useQuery } from '@tanstack/react-query';

import { getSectors } from '@/apis/sector';

// 카테고리는 거의 바뀌지 않으므로 한 번 받아 두고 계속 씁니다.
export const useSectorsQuery = () =>
  useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors,
    staleTime: Infinity,
  });
