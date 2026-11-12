import { ProductTradeStatusBadge } from '@/components/product/ProductTradeStatusBadge';
import type { ProductTradeStatus } from '@/types/product';

type ProductTitleProps = {
  productId: string;
  productName: string;
  tradeStatus: ProductTradeStatus;
};

// 상품 ID · 상품명 + 현재 상품 상태
export function ProductTitle({ productId, productName, tradeStatus }: ProductTitleProps) {
  return (
    <div className="flex items-center gap-2.5">
      <h2 className="text-title-lg font-bold text-motu-text-primary">
        {productId} · {productName}
      </h2>
      <ProductTradeStatusBadge status={tradeStatus} />
    </div>
  );
}
