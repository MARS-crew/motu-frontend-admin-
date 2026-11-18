import { api } from '@/apis/instance';
import type { ApiResponse, PageResponse } from '@/types/api';
import type {
  ListingApplicationItem,
  ListingApplicationResponse,
  ListingApplicationsParams,
} from '@/types/listing';

// 심사 대상 상장 신청 목록 (최근 접수순)
export const getListingApplications = async (params: ListingApplicationsParams) => {
  const { data } = await api.get<ApiResponse<PageResponse<ListingApplicationItem>>>(
    '/admin/listing-applications',
    { params },
  );
  return data.data;
};

export const getListingApplication = async (id: number) => {
  const { data } = await api.get<ApiResponse<ListingApplicationResponse>>(
    `/admin/listing-applications/${id}`,
  );
  return data.data;
};

// 첨부 파일 원본 (인증이 필요해 <img src> 로 바로 쓰지 않고 Blob 으로 받습니다)
export const getListingAttachmentContent = async (id: number, attachmentId: string) => {
  const { data } = await api.get<Blob>(
    `/admin/listing-applications/${id}/attachments/${encodeURIComponent(attachmentId)}/content`,
    { responseType: 'blob', timeout: 60_000 },
  );
  return data;
};
