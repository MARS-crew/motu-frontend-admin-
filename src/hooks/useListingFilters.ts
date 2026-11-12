import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { DEFAULT_APPLIED_PERIOD_DAYS } from '@/constants/listing';
import type { ListingApplicationFilters } from '@/types/listing';
import { addDays, toISODate } from '@/utils/date';

const getDefaultPeriod = () => {
  const today = new Date();
  return {
    appliedFrom: toISODate(addDays(today, -(DEFAULT_APPLIED_PERIOD_DAYS - 1))),
    appliedTo: toISODate(today),
  };
};

// 상장 신청 목록의 검색 조건을 URL 쿼리로 관리합니다.
// 상세에서 [목록으로] 돌아와도 같은 쿼리로 검색 조건이 유지됩니다.
// 신청 기간 쿼리가 없으면 최근 30일, 빈 값(from=&to=)이면 전체 기간입니다.
export const useListingFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ListingApplicationFilters>(() => {
    const defaultPeriod = getDefaultPeriod();
    return {
      status: (searchParams.get('status') as ListingApplicationFilters['status']) ?? 'ALL',
      applicant: searchParams.get('applicant') ?? '',
      category: (searchParams.get('category') as ListingApplicationFilters['category']) ?? 'ALL',
      appliedFrom: searchParams.has('from')
        ? searchParams.get('from') || null
        : defaultPeriod.appliedFrom,
      appliedTo: searchParams.has('to') ? searchParams.get('to') || null : defaultPeriod.appliedTo,
    };
  }, [searchParams]);

  const applyFilters = (next: ListingApplicationFilters) => {
    const params = new URLSearchParams();
    if (next.status !== 'ALL') params.set('status', next.status);
    if (next.applicant.trim()) params.set('applicant', next.applicant.trim());
    if (next.category !== 'ALL') params.set('category', next.category);
    params.set('from', next.appliedFrom ?? '');
    params.set('to', next.appliedTo ?? '');
    setSearchParams(params);
  };

  return { filters, applyFilters };
};
