import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { NoticeFilters } from '@/types/notice';

// 공지 목록 조회 조건을 URL 쿼리로 관리합니다. 조건을 바꾸면 바로 목록에 반영합니다.
export const useNoticeFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<NoticeFilters>(
    () => ({
      keyword: searchParams.get('keyword') ?? '',
      type: (searchParams.get('type') as NoticeFilters['type']) ?? 'ALL',
      status: (searchParams.get('status') as NoticeFilters['status']) ?? 'ALL',
      from: searchParams.get('from'),
      to: searchParams.get('to'),
    }),
    [searchParams],
  );

  const updateFilters = (next: Partial<NoticeFilters>) => {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();
    if (merged.keyword.trim()) params.set('keyword', merged.keyword.trim());
    if (merged.type !== 'ALL') params.set('type', merged.type);
    if (merged.status !== 'ALL') params.set('status', merged.status);
    if (merged.from && merged.to) {
      params.set('from', merged.from);
      params.set('to', merged.to);
    }
    setSearchParams(params, { replace: true });
  };

  return { filters, updateFilters };
};
