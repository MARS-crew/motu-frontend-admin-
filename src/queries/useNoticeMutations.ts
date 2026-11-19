import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  patchAdminNotice,
  postAdminNotice,
  postDeleteAdminNotice,
  postHideAdminNotice,
  postPublishAdminNotice,
} from '@/apis/adminNotice';
import { NOTICES_QUERY_KEY } from '@/queries/useNoticesQuery';
import { ACTIVITY_LOGS_QUERY_KEY } from '@/queries/useProductHistoriesQuery';
import type { AdminNoticeRequest, CreateAdminNoticeRequest } from '@/types/notice';

// 공지를 바꾸면 공지 목록·상세와 관리자 활동 이력을 다시 불러옵니다.
const useInvalidateNotices = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: NOTICES_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
    ]);
};

export const useCreateNoticeMutation = () => {
  const invalidate = useInvalidateNotices();
  return useMutation({
    mutationFn: (body: CreateAdminNoticeRequest) => postAdminNotice(body),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useUpdateNoticeMutation = (noticeId: number) => {
  const invalidate = useInvalidateNotices();
  return useMutation({
    mutationFn: (body: AdminNoticeRequest) => patchAdminNotice(noticeId, body),
    retry: false,
    onSuccess: invalidate,
  });
};

export const usePublishNoticeMutation = (noticeId: number) => {
  const invalidate = useInvalidateNotices();
  return useMutation({
    mutationFn: (body: AdminNoticeRequest) => postPublishAdminNotice(noticeId, body),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useHideNoticeMutation = (noticeId: number) => {
  const invalidate = useInvalidateNotices();
  return useMutation({
    mutationFn: (reason: string) => postHideAdminNotice(noticeId, reason),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useDeleteNoticeMutation = (noticeId: number) => {
  const invalidate = useInvalidateNotices();
  return useMutation({
    mutationFn: (reason: string) => postDeleteAdminNotice(noticeId, reason),
    retry: false,
    onSuccess: invalidate,
  });
};
