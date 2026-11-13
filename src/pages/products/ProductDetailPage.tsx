import { useParams, useSearchParams } from 'react-router';

import { Chip } from '@/components/common/Chip';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { ProductActions } from '@/components/product/ProductActions';
import {
  ProductBasicInfoCards,
  ProductHistorySection,
  ProductMetricsCards,
} from '@/components/product/ProductDetailCards';
import { ProductTitle } from '@/components/product/ProductTitle';
import { PRODUCT_DETAIL_TABS } from '@/constants/product';
import { getProductDetailPreview } from '@/constants/productPreview';
import type { ProductDetailTab } from '@/types/product';

const isProductDetailTab = (value: string | null): value is ProductDetailTab =>
  PRODUCT_DETAIL_TABS.some((tab) => tab.value === value);

// ADM-PRD-02 상장 상품 상세 (기본 정보 · 서비스 지표 · 변경 이력 탭)
export default function ProductDetailPage() {
  const { productId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = isProductDetailTab(tabParam) ? tabParam : 'basic';

  const handleChangeTab = (value: ProductDetailTab) =>
    setSearchParams({ tab: value }, { replace: true });

  // TODO(MOTU-22-1): 상장 상품 상세 API 연동
  const product = getProductDetailPreview(productId);
  if (!product) return <PlaceholderSection description="상장 상품을 찾을 수 없습니다." />;

  return (
    <div className="flex flex-col gap-5">
      <ProductTitle
        productId={product.productId}
        productName={product.productName}
        tradeStatus={product.tradeStatus}
      />

      <div role="tablist" aria-label="상품 상세 탭" className="flex gap-2">
        {PRODUCT_DETAIL_TABS.map((option) => (
          <Chip
            key={option.value}
            role="tab"
            aria-selected={tab === option.value}
            isSelected={tab === option.value}
            onClick={() => handleChangeTab(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>

      {tab === 'basic' && <ProductBasicInfoCards product={product} />}
      {tab === 'metrics' && <ProductMetricsCards product={product} />}
      {tab === 'history' && <ProductHistorySection product={product} />}

      <ProductActions productId={product.productId} tradeStatus={product.tradeStatus} />
    </div>
  );
}
