import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { ProductFilters } from '@/types/product';

// 상장 상품 목록의 검색 조건과 페이지를 URL 쿼리로 관리합니다. (상세에서 돌아와도 유지)
export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ProductFilters>(
    () => ({
      keyword: searchParams.get('keyword') ?? '',
      tradeStatus: (searchParams.get('status') as ProductFilters['tradeStatus']) ?? 'ALL',
      sectorCode: searchParams.get('sector') ?? 'ALL',
      exposure: (searchParams.get('exposure') as ProductFilters['exposure']) ?? 'ALL',
      page: Math.max(Number(searchParams.get('page')) || 1, 1),
    }),
    [searchParams],
  );

  const toParams = (next: ProductFilters) => {
    const params = new URLSearchParams();
    if (next.keyword.trim()) params.set('keyword', next.keyword.trim());
    if (next.tradeStatus !== 'ALL') params.set('status', next.tradeStatus);
    if (next.sectorCode !== 'ALL') params.set('sector', next.sectorCode);
    if (next.exposure !== 'ALL') params.set('exposure', next.exposure);
    if (next.page > 1) params.set('page', String(next.page));
    return params;
  };

  // 검색 조건을 바꾸면 첫 페이지부터 봅니다.
  const applyFilters = (next: Omit<ProductFilters, 'page'>) =>
    setSearchParams(toParams({ ...next, page: 1 }));

  const changePage = (page: number) => setSearchParams(toParams({ ...filters, page }));

  return { filters, applyFilters, changePage };
};
