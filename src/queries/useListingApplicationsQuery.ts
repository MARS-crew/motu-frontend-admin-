import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getListingApplications } from '@/apis/listingApplication';
import { LISTING_PAGE_SIZE } from '@/constants/listing';
import type { ListingApplicationFilters } from '@/types/listing';
import { toListingApplicationsParams } from '@/utils/listing';

export const LISTING_APPLICATIONS_QUERY_KEY = ['admin', 'listing-applications'];

export const useListingApplicationsQuery = (filters: ListingApplicationFilters) =>
  useQuery({
    queryKey: [...LISTING_APPLICATIONS_QUERY_KEY, 'list', filters],
    queryFn: () => getListingApplications(toListingApplicationsParams(filters, LISTING_PAGE_SIZE)),
    select: (data) => ({
      applications: data.items,
      totalPages: Math.max(Math.ceil(data.totalCount / LISTING_PAGE_SIZE), 1),
    }),
    // 페이지·검색 조건을 바꾸는 동안 이전 목록을 유지해 깜빡이지 않게 합니다.
    placeholderData: keepPreviousData,
  });
