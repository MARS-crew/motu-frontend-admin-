import { useQuery } from '@tanstack/react-query';

import { getAdminStocks } from '@/apis/adminStock';
import type { SelectOption } from '@/components/common/Select';
import { PRODUCTS_QUERY_KEY } from '@/queries/useProductsQuery';
import { formatProductCode } from '@/utils/product';

// 선택 목록에 한 번에 불러오는 최대 상품 수 (API 최대 페이지 크기)
const PRODUCT_OPTIONS_SIZE = 100;

// 공지 대상 상품 선택 목록 (상품명 / PRD-018, 값은 상품 ID)
export const useProductOptionsQuery = () =>
  useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'options'],
    queryFn: () => getAdminStocks({ page: 1, size: PRODUCT_OPTIONS_SIZE }),
    select: (data): SelectOption[] =>
      data.items.map((item) => ({
        value: String(item.stockId),
        label: `${item.name} / ${formatProductCode(item.stockId)}`,
      })),
  });
