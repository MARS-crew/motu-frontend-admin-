import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { MemberFilters } from '@/types/member';

// 회원 목록의 검색 조건과 페이지를 URL 쿼리로 관리합니다. (상세에서 돌아와도 유지)
export const useMemberFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<MemberFilters>(
    () => ({
      loginId: searchParams.get('loginId') ?? '',
      nickname: searchParams.get('nickname') ?? '',
      status: (searchParams.get('status') as MemberFilters['status']) ?? 'ALL',
      page: Math.max(Number(searchParams.get('page')) || 1, 1),
    }),
    [searchParams],
  );

  const toParams = (next: MemberFilters) => {
    const params = new URLSearchParams();
    if (next.loginId.trim()) params.set('loginId', next.loginId.trim());
    if (next.nickname.trim()) params.set('nickname', next.nickname.trim());
    if (next.status !== 'ALL') params.set('status', next.status);
    if (next.page > 1) params.set('page', String(next.page));
    return params;
  };

  // 검색 조건을 바꾸면 첫 페이지부터 봅니다.
  const applyFilters = (next: Omit<MemberFilters, 'page'>) =>
    setSearchParams(toParams({ ...next, page: 1 }));

  const changePage = (page: number) => setSearchParams(toParams({ ...filters, page }));

  return { filters, applyFilters, changePage };
};
