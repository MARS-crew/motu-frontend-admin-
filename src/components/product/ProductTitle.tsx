import { ProductTradeStatusBadge } from '@/components/product/ProductTradeStatusBadge';
import type { ProductTradeStatus } from '@/types/product';

type ProductTitleProps = {
  // 화면 표시용 상품 ID (PRD-018)
  productCode: string;
  productName: string;
  tradeStatus: ProductTradeStatus;
};

// 상품 ID · 상품명 + 현재 상품 상태
export function ProductTitle({ productCode, productName, tradeStatus }: ProductTitleProps) {
  return (
    <div className="flex items-center gap-2.5">
      <h2 className="text-title-lg font-bold text-motu-text-primary">
        {productCode} · {productName}
      </h2>
      <ProductTradeStatusBadge status={tradeStatus} />
    </div>
  );
}
