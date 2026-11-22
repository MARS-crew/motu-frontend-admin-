import { api } from '@/apis/instance';
import type { ApiResponse, PageResponse } from '@/types/api';
import type {
  AdminInquiriesParams,
  AdminInquiryItem,
  AdminInquiryResponse,
  SendInquiryReplyRequest,
} from '@/types/inquiry';

// 계정·인증 문의 목록 (최신순)
export const getAdminInquiries = async (params: AdminInquiriesParams) => {
  const { data } = await api.get<ApiResponse<PageResponse<AdminInquiryItem>>>('/admin/inquiries', {
    params,
  });
  return data.data;
};

export const getAdminInquiry = async (id: number) => {
  const { data } = await api.get<ApiResponse<AdminInquiryResponse>>(`/admin/inquiries/${id}`);
  return data.data;
};

// 처리 시작 (로그인한 관리자를 담당자로 기록)
export const postStartInquiry = async (id: number) => {
  await api.post(`/admin/inquiries/${id}/start-processing`);
};

// 답변 초안 저장 (다른 관리자의 편집과 충돌하면 409). 저장된 버전을 돌려줍니다.
export const patchInquiryReplyDraft = async (
  id: number,
  expectedVersion: number,
  replyText: string,
) => {
  const { data } = await api.patch<ApiResponse<{ replyVersion: number }>>(
    `/admin/inquiries/${id}/reply-draft`,
    { expectedVersion, replyText },
  );
  return data.data;
};

// 답변 이메일 발송 및 처리 완료 (모의 발송이면 처리 중으로 남습니다)
export const postSendInquiryReply = async (id: number, body: SendInquiryReplyRequest) => {
  const { data } = await api.post<ApiResponse<{ simulated: boolean }>>(
    `/admin/inquiries/${id}/send-reply`,
    body,
  );
  return data.data;
};
