import { api } from '@/apis/instance';
import type { ApiResponse, PageResponse } from '@/types/api';
import type {
  ApproveListingRequest,
  ExtendRevisionDeadlineRequest,
  ListingApplicationItem,
  ListingApplicationResponse,
  ListingApplicationsParams,
  RequestListingRevisionRequest,
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

// 접수 상태 신청을 검토중으로 바꿉니다. (심사 결과 처리 화면으로 넘어가기 전)
export const postStartListingReview = async (id: number) => {
  await api.post(`/admin/listing-applications/${id}/start-review`);
};

// 상장 승인 (거래 대기 상품 생성)
export const postApproveListing = async (id: number, body: ApproveListingRequest) => {
  await api.post(`/admin/listing-applications/${id}/approve`, body);
};

export const postRequestListingRevision = async (
  id: number,
  body: RequestListingRevisionRequest,
) => {
  await api.post(`/admin/listing-applications/${id}/revision-requests`, body);
};

export const postRejectListing = async (id: number, reason: string) => {
  await api.post(`/admin/listing-applications/${id}/reject`, { reason });
};

// 재제출하지 않은 보완 요청의 기한 연장
export const postExtendRevisionDeadline = async (
  id: number,
  revisionId: number,
  body: ExtendRevisionDeadlineRequest,
) => {
  await api.post(
    `/admin/listing-applications/${id}/revision-requests/${revisionId}/extend-deadline`,
    body,
  );
};
