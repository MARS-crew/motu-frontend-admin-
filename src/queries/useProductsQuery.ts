import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getAdminStocks } from '@/apis/adminStock';
import { PRODUCT_PAGE_SIZE } from '@/constants/product';
import type { ProductFilters } from '@/types/product';
import { toAdminStocksParams, toProductSummary } from '@/utils/product';

export const PRODUCTS_QUERY_KEY = ['admin', 'stocks'];

export const useProductsQuery = (filters: ProductFilters) =>
  useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'list', filters],
    queryFn: () => getAdminStocks(toAdminStocksParams(filters, PRODUCT_PAGE_SIZE)),
    select: (data) => ({
      products: data.items.map(toProductSummary),
      totalPages: Math.max(Math.ceil(data.totalCount / PRODUCT_PAGE_SIZE), 1),
    }),
    // 페이지·검색 조건을 바꾸는 동안 이전 목록을 유지해 깜빡이지 않게 합니다.
    placeholderData: keepPreviousData,
  });
