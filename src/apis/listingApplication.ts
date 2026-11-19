import { api } from '@/apis/instance';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { ListingApplicationItem, ListingApplicationsParams } from '@/types/listing';

// 심사 대상 상장 신청 목록 (최근 접수순)
export const getListingApplications = async (params: ListingApplicationsParams) => {
  const { data } = await api.get<ApiResponse<PageResponse<ListingApplicationItem>>>(
    '/admin/listing-applications',
    { params },
  );
  return data.data;
};
