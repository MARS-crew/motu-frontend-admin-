import { useParams, useSearchParams } from 'react-router';

import { Chip } from '@/components/common/Chip';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { ProductActions } from '@/components/product/ProductActions';
import {
  ProductBasicInfoCards,
  ProductHistorySection,
  ProductMetricsCard,
} from '@/components/product/ProductDetailCards';
import { ProductTitle } from '@/components/product/ProductTitle';
import { PRODUCT_DETAIL_TABS } from '@/constants/product';
import { useProductDetailQuery } from '@/queries/useProductDetailQuery';
import type { ProductDetailTab } from '@/types/product';
import { getApiErrorMessage } from '@/utils/apiError';

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

  const { data: product, isPending, isError, error } = useProductDetailQuery(Number(productId));

  if (isError) return <PlaceholderSection description={getApiErrorMessage(error)} />;
  if (isPending) {
    return (
      <PlaceholderSection
        description={
          Number(productId) > 0 ? '상장 상품을 불러오는 중입니다.' : '상장 상품을 찾을 수 없습니다.'
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <ProductTitle
        productCode={product.productCode}
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
      {tab === 'metrics' && <ProductMetricsCard product={product} />}
      {tab === 'history' && <ProductHistorySection product={product} />}

      <ProductActions productId={product.productId} tradeStatus={product.tradeStatus} />
    </div>
  );
}
