import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getAdminInquiries, getAdminInquiry } from '@/apis/adminInquiry';
import { INQUIRY_PAGE_SIZE } from '@/constants/inquiry';
import type { InquiryFilters } from '@/types/inquiry';
import { toAdminInquiriesParams, toInquiryDetail, toInquirySummary } from '@/utils/inquiry';

export const INQUIRIES_QUERY_KEY = ['admin', 'inquiries'];

export const useInquiriesQuery = (filters: InquiryFilters) =>
  useQuery({
    queryKey: [...INQUIRIES_QUERY_KEY, 'list', filters],
    queryFn: () => getAdminInquiries(toAdminInquiriesParams(filters, INQUIRY_PAGE_SIZE)),
    select: (data) => ({
      inquiries: data.items.map(toInquirySummary),
      totalPages: Math.max(Math.ceil(data.totalCount / INQUIRY_PAGE_SIZE), 1),
    }),
    // 페이지·검색 조건을 바꾸는 동안 이전 목록을 유지해 깜빡이지 않게 합니다.
    placeholderData: keepPreviousData,
  });

// 선택한 문의 상세 (답변 초안·최근 발송 결과 포함)
export const useInquiryDetailQuery = (id: number | null) =>
  useQuery({
    queryKey: [...INQUIRIES_QUERY_KEY, 'detail', id],
    queryFn: () => getAdminInquiry(id ?? 0),
    select: toInquiryDetail,
    enabled: id !== null,
  });
