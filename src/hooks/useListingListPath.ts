import { useLocation } from 'react-router';

import { ROUTES } from '@/constants/routes';

export type ListingLocationState = {
  // 목록에서 넘겨준 검색 쿼리 (?status=...&from=...)
  listSearch?: string;
} | null;

// 상장 신청 목록으로 돌아갈 경로입니다. 목록에서 넘겨준 검색 조건을 유지합니다.
export const useListingListPath = () => {
  const location = useLocation();
  const listSearch = (location.state as ListingLocationState)?.listSearch ?? '';
  return {
    listPath: `${ROUTES.LISTINGS}${listSearch}`,
    // 상세 → 심사 처리로 이동할 때도 검색 조건을 계속 넘깁니다.
    locationState: { listSearch } satisfies ListingLocationState,
  };
};
