import { Link } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { ProductTradeStatusBadge } from '@/components/product/ProductTradeStatusBadge';
import { LISTING_CATEGORY_LABELS } from '@/constants/listing';
import { getProductDetailPath } from '@/constants/routes';
import type { ProductSummary } from '@/types/product';
import { formatMonthDayTime } from '@/utils/date';
import { formatNumber } from '@/utils/format';

type ProductTableProps = {
  products: ProductSummary[];
};

// ADM-PRD-01 상장 상품 목록 (상품명·카테고리·상품 상태·거래 시작일시·현재가)
export function ProductTable({ products }: ProductTableProps) {
  const columns: TableColumn<ProductSummary>[] = [
    { id: 'productName', header: '상품명', cell: (row) => row.productName, isEmphasized: true },
    { id: 'category', header: '카테고리', cell: (row) => LISTING_CATEGORY_LABELS[row.category] },
    {
      id: 'tradeStatus',
      header: '상품 상태',
      cell: (row) => <ProductTradeStatusBadge status={row.tradeStatus} />,
    },
    {
      id: 'tradeStartAt',
      header: '거래 시작',
      cell: (row) => formatMonthDayTime(row.tradeStartAt),
    },
    {
      id: 'currentPrice',
      header: '현재가',
      cell: (row) => (row.currentPrice === null ? '-' : `${formatNumber(row.currentPrice)}P`),
    },
    {
      id: 'action',
      header: '관리',
      cell: (row) => (
        <Link
          to={getProductDetailPath(row.productId)}
          className={buttonClassName({ variant: 'secondary', size: 'sm' })}
        >
          상세
        </Link>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={products}
      getRowKey={(row) => row.productId}
      gridClassName="grid-cols-[1.5fr_repeat(5,1fr)]"
      emptyMessage="조건에 맞는 상장 상품이 없습니다."
    />
  );
}
