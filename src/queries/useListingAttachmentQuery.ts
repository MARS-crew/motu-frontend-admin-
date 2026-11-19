import { useQuery } from '@tanstack/react-query';

import { getListingAttachmentContent } from '@/apis/listingApplication';
import { LISTING_APPLICATIONS_QUERY_KEY } from '@/queries/useListingApplicationsQuery';

export const getListingAttachmentQueryOptions = (applicationId: number, attachmentId: string) => ({
  queryKey: [...LISTING_APPLICATIONS_QUERY_KEY, 'attachment', applicationId, attachmentId],
  queryFn: () => getListingAttachmentContent(applicationId, attachmentId),
  // 제출된 파일은 바뀌지 않으므로 한 번 받은 파일을 계속 씁니다.
  staleTime: Infinity,
});

// 첨부 파일 원본 (미리보기·대표 이미지). attachmentId 가 없으면 받지 않습니다.
export const useListingAttachmentQuery = (applicationId: number, attachmentId: string | null) =>
  useQuery({
    ...getListingAttachmentQueryOptions(applicationId, attachmentId ?? ''),
    enabled: attachmentId !== null,
  });
