import { useQuery } from '@tanstack/react-query';

import { getListingApplication } from '@/apis/listingApplication';
import { LISTING_APPLICATIONS_QUERY_KEY } from '@/queries/useListingApplicationsQuery';
import { toListingApplicationDetail } from '@/utils/listing';

export const getListingApplicationQueryKey = (id: number) => [
  ...LISTING_APPLICATIONS_QUERY_KEY,
  'detail',
  id,
];

// 상장 신청 상세 (주소의 신청 ID 가 숫자가 아니면 조회하지 않습니다)
export const useListingApplicationQuery = (id: number) =>
  useQuery({
    queryKey: getListingApplicationQueryKey(id),
    queryFn: () => getListingApplication(id),
    select: toListingApplicationDetail,
    enabled: Number.isInteger(id) && id > 0,
  });
