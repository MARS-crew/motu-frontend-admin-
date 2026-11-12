import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { ProductFilters } from '@/types/product';

// 상장 상품 목록의 검색 조건을 URL 쿼리로 관리합니다. (상세에서 돌아와도 유지)
export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ProductFilters>(
    () => ({
      keyword: searchParams.get('keyword') ?? '',
      tradeStatus: (searchParams.get('status') as ProductFilters['tradeStatus']) ?? 'ALL',
      category: (searchParams.get('category') as ProductFilters['category']) ?? 'ALL',
      exposure: (searchParams.get('exposure') as ProductFilters['exposure']) ?? 'ALL',
    }),
    [searchParams],
  );

  const applyFilters = (next: ProductFilters) => {
    const params = new URLSearchParams();
    if (next.keyword.trim()) params.set('keyword', next.keyword.trim());
    if (next.tradeStatus !== 'ALL') params.set('status', next.tradeStatus);
    if (next.category !== 'ALL') params.set('category', next.category);
    if (next.exposure !== 'ALL') params.set('exposure', next.exposure);
    setSearchParams(params);
  };

  return { filters, applyFilters };
};
