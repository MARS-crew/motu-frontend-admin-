import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  patchInquiryReplyDraft,
  postSendInquiryReply,
  postStartInquiry,
} from '@/apis/adminInquiry';
import { ACTIVITY_LOGS_QUERY_KEY } from '@/queries/useActivityLogsQuery';
import { DASHBOARD_QUERY_KEY } from '@/queries/useDashboardQuery';
import { INQUIRIES_QUERY_KEY } from '@/queries/useInquiriesQuery';

// 문의를 처리하면 문의 목록·상세, 대시보드 처리 대기 건수, 활동 이력을 다시 불러옵니다.
const useInvalidateInquiries = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: INQUIRIES_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
    ]);
};

export const useStartInquiryMutation = (id: number) => {
  const invalidate = useInvalidateInquiries();
  return useMutation({
    mutationFn: () => postStartInquiry(id),
    retry: false,
    onSuccess: invalidate,
  });
};

// 확인 모달을 띄우기 전에 답변을 초안으로 저장하고, 저장된 버전으로 발송합니다.
export const useSaveInquiryDraftMutation = (id: number) =>
  useMutation({
    mutationFn: ({ expectedVersion, replyText }: { expectedVersion: number; replyText: string }) =>
      patchInquiryReplyDraft(id, expectedVersion, replyText),
    retry: false,
  });

export const useSendInquiryReplyMutation = (id: number) => {
  const invalidate = useInvalidateInquiries();
  return useMutation({
    // 발송마다 새 요청 ID 를 만듭니다.
    mutationFn: (expectedDraftVersion: number) =>
      postSendInquiryReply(id, { requestId: crypto.randomUUID(), expectedDraftVersion }),
    retry: false,
    // 실패해도 발송 시도 결과가 기록될 수 있어 상세를 다시 불러옵니다.
    onSettled: invalidate,
  });
};
