import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { NoticeFilters } from '@/types/notice';

// 공지 목록 조회 조건과 페이지를 URL 쿼리로 관리합니다. 조건을 바꾸면 바로 목록에 반영합니다.
export const useNoticeFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<NoticeFilters>(
    () => ({
      keyword: searchParams.get('keyword') ?? '',
      type: (searchParams.get('type') as NoticeFilters['type']) ?? 'ALL',
      status: (searchParams.get('status') as NoticeFilters['status']) ?? 'ALL',
      from: searchParams.get('from'),
      to: searchParams.get('to'),
      page: Math.max(Number(searchParams.get('page')) || 1, 1),
    }),
    [searchParams],
  );

  const applyParams = (next: NoticeFilters) => {
    const params = new URLSearchParams();
    if (next.keyword.trim()) params.set('keyword', next.keyword.trim());
    if (next.type !== 'ALL') params.set('type', next.type);
    if (next.status !== 'ALL') params.set('status', next.status);
    if (next.from && next.to) {
      params.set('from', next.from);
      params.set('to', next.to);
    }
    if (next.page > 1) params.set('page', String(next.page));
    setSearchParams(params, { replace: true });
  };

  // 조회 조건을 바꾸면 첫 페이지부터 봅니다.
  const updateFilters = (next: Partial<Omit<NoticeFilters, 'page'>>) =>
    applyParams({ ...filters, ...next, page: 1 });

  const changePage = (page: number) => applyParams({ ...filters, page });

  return { filters, updateFilters, changePage };
};
