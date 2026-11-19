import { useQuery } from '@tanstack/react-query';

import { getAdminStock } from '@/apis/adminStock';
import { PRODUCTS_QUERY_KEY } from '@/queries/useProductsQuery';
import { toProductDetail } from '@/utils/product';

export const getProductDetailQueryKey = (stockId: number) => [
  ...PRODUCTS_QUERY_KEY,
  'detail',
  stockId,
];

// 상장 상품 상세 (주소의 상품 ID 가 숫자가 아니면 조회하지 않습니다)
export const useProductDetailQuery = (stockId: number) =>
  useQuery({
    queryKey: getProductDetailQueryKey(stockId),
    queryFn: () => getAdminStock(stockId),
    select: toProductDetail,
    enabled: Number.isInteger(stockId) && stockId > 0,
  });
