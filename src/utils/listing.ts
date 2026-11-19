import type { ListingApplicationFilters, ListingApplicationsParams } from '@/types/listing';
import { addDays, parseISODate, toISODate, toKSTStartOfDay } from '@/utils/date';

// 화면 검색 조건 → 목록 API 파라미터
// 신청 기간 종료일은 그날 하루를 포함하도록 다음 날 자정(미포함)으로 보냅니다.
export const toListingApplicationsParams = (
  filters: ListingApplicationFilters,
  size: number,
): ListingApplicationsParams => {
  const appliedTo = parseISODate(filters.appliedTo);
  return {
    status: filters.status === 'ALL' ? undefined : filters.status,
    applicant: filters.applicant.trim() || undefined,
    sectorCode: filters.sectorCode === 'ALL' ? undefined : Number(filters.sectorCode),
    from: filters.appliedFrom ? toKSTStartOfDay(filters.appliedFrom) : undefined,
    to: appliedTo ? toKSTStartOfDay(toISODate(addDays(appliedTo, 1))) : undefined,
    page: filters.page,
    size,
  };
};
