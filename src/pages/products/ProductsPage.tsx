import { ProductFilterCard } from '@/components/product/ProductFilterCard';
import { ProductTable } from '@/components/product/ProductTable';
import { PRODUCTS_PREVIEW } from '@/constants/productPreview';
import { useProductFilters } from '@/hooks/useProductFilters';
import type { ProductFilters, ProductSummary } from '@/types/product';

// TODO(MOTU-22-1): 서버 검색으로 교체합니다. 퍼블리싱 확인용으로 예시 데이터를 거릅니다.
const filterPreview = (products: ProductSummary[], filters: ProductFilters) => {
  const keyword = filters.keyword.trim().toLowerCase();
  return products.filter(
    (product) =>
      (!keyword ||
        product.productName.toLowerCase().includes(keyword) ||
        product.productId.toLowerCase().includes(keyword)) &&
      (filters.tradeStatus === 'ALL' || product.tradeStatus === filters.tradeStatus) &&
      (filters.category === 'ALL' || product.category === filters.category) &&
      (filters.exposure === 'ALL' || product.exposure === filters.exposure),
  );
};

// ADM-PRD-01 상장 상품 목록 (상장 승인 전 신청은 상장 신청 목록에서 조회합니다)
export default function ProductsPage() {
  const { filters, applyFilters } = useProductFilters();
  const products = filterPreview(PRODUCTS_PREVIEW, filters);

  return (
    <div className="flex flex-col gap-5">
      <ProductFilterCard key={JSON.stringify(filters)} filters={filters} onSearch={applyFilters} />
      <ProductTable products={products} />
    </div>
  );
}
