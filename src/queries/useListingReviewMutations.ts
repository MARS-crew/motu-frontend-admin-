import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  postApproveListing,
  postExtendRevisionDeadline,
  postRejectListing,
  postRequestListingRevision,
  postStartListingReview,
} from '@/apis/listingApplication';
import { ACTIVITY_LOGS_QUERY_KEY } from '@/queries/useActivityLogsQuery';
import { LISTING_APPLICATIONS_QUERY_KEY } from '@/queries/useListingApplicationsQuery';
import { PRODUCTS_QUERY_KEY } from '@/queries/useProductsQuery';
import type {
  ApproveListingRequest,
  ExtendRevisionDeadlineRequest,
  RequestListingRevisionRequest,
} from '@/types/listing';

// 심사 처리 후 상장 신청 목록·상세, 상장 상품(승인 시 생성), 활동 이력을 다시 불러옵니다.
const useInvalidateListing = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: LISTING_APPLICATIONS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
    ]);
};

export const useStartListingReviewMutation = (id: number) => {
  const invalidate = useInvalidateListing();
  return useMutation({
    mutationFn: () => postStartListingReview(id),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useApproveListingMutation = (id: number) => {
  const invalidate = useInvalidateListing();
  return useMutation({
    mutationFn: (body: ApproveListingRequest) => postApproveListing(id, body),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useRequestListingRevisionMutation = (id: number) => {
  const invalidate = useInvalidateListing();
  return useMutation({
    mutationFn: (body: RequestListingRevisionRequest) => postRequestListingRevision(id, body),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useRejectListingMutation = (id: number) => {
  const invalidate = useInvalidateListing();
  return useMutation({
    mutationFn: (reason: string) => postRejectListing(id, reason),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useExtendRevisionDeadlineMutation = (id: number) => {
  const invalidate = useInvalidateListing();
  return useMutation({
    mutationFn: ({ revisionId, ...body }: ExtendRevisionDeadlineRequest & { revisionId: number }) =>
      postExtendRevisionDeadline(id, revisionId, body),
    retry: false,
    onSuccess: invalidate,
  });
};
