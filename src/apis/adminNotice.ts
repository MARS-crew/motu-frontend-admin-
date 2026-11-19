import { api } from '@/apis/instance';
import type { ApiResponse, PageResponse } from '@/types/api';
import type {
  AdminNoticeItem,
  AdminNoticeRequest,
  AdminNoticeResponse,
  AdminNoticesParams,
  CreateAdminNoticeRequest,
} from '@/types/notice';

export const getAdminNotices = async (params: AdminNoticesParams) => {
  const { data } = await api.get<ApiResponse<PageResponse<AdminNoticeItem>>>('/admin/notices', {
    params,
  });
  return data.data;
};

export const getAdminNotice = async (noticeId: number) => {
  const { data } = await api.get<ApiResponse<AdminNoticeResponse>>(`/admin/notices/${noticeId}`);
  return data.data;
};

// 새 공지 임시 저장(DRAFT) 또는 게시(POSTED)
export const postAdminNotice = async (body: CreateAdminNoticeRequest) => {
  const { data } = await api.post<ApiResponse<AdminNoticeResponse>>('/admin/notices', body);
  return data.data;
};

// 기존 공지 내용 저장 (상태는 바꾸지 않습니다)
export const patchAdminNotice = async (noticeId: number, body: AdminNoticeRequest) => {
  const { data } = await api.patch<ApiResponse<AdminNoticeResponse>>(
    `/admin/notices/${noticeId}`,
    body,
  );
  return data.data;
};

// 기존 공지를 입력값으로 게시 또는 다시 게시 (시작일시가 미래이면 게시 예약)
export const postPublishAdminNotice = async (noticeId: number, body: AdminNoticeRequest) => {
  const { data } = await api.post<ApiResponse<AdminNoticeResponse>>(
    `/admin/notices/${noticeId}/publish`,
    body,
  );
  return data.data;
};

export const postHideAdminNotice = async (noticeId: number, reason: string) => {
  await api.post(`/admin/notices/${noticeId}/hide`, { reason });
};

export const postDeleteAdminNotice = async (noticeId: number, reason: string) => {
  await api.post(`/admin/notices/${noticeId}/delete`, { reason });
};
