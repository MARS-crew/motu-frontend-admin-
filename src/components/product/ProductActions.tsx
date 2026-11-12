import { Link } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import { getProductClosePath, getProductEditPath, getProductTradingPath } from '@/constants/routes';
import type { ProductTradeStatus } from '@/types/product';

type ProductActionsProps = {
  productId: string;
  tradeStatus: ProductTradeStatus;
};

// 현재 상태에 따라 [거래 중지]·[거래 재개] 또는 [상품 종료]를 제공합니다.
// 거래 종료 상품은 다시 거래 가능으로 되돌릴 수 없습니다.
export function ProductActions({ productId, tradeStatus }: ProductActionsProps) {
  return (
    <div className="flex gap-2">
      <Link to={getProductEditPath(productId)} className={buttonClassName()}>
        상품 정보 수정
      </Link>
      {(tradeStatus === 'ACTIVE' || tradeStatus === 'PAUSED') && (
        <Link
          to={getProductTradingPath(productId)}
          className={buttonClassName({ variant: 'secondary' })}
        >
          {tradeStatus === 'ACTIVE' ? '거래 중지' : '거래 재개'}
        </Link>
      )}
      {tradeStatus !== 'CLOSED' && (
        <Link
          to={getProductClosePath(productId)}
          className={buttonClassName({ variant: 'danger' })}
        >
          상품 종료
        </Link>
      )}
    </div>
  );
}
