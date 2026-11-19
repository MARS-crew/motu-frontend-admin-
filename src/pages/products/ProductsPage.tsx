import { Pagination } from '@/components/common/Pagination';
import { ProductFilterCard } from '@/components/product/ProductFilterCard';
import { ProductTable } from '@/components/product/ProductTable';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useProductsQuery } from '@/queries/useProductsQuery';
import { getApiErrorMessage } from '@/utils/apiError';

// ADM-PRD-01 상장 상품 목록 (최근 등록순, 한 페이지 20건)
// 상장 승인 전 신청은 상장 신청 목록에서 조회합니다.
export default function ProductsPage() {
  const { filters, applyFilters, changePage } = useProductFilters();
  const { data, isPending, isError, error } = useProductsQuery(filters);

  const emptyMessage = isPending
    ? '상장 상품을 불러오는 중입니다.'
    : isError
      ? getApiErrorMessage(error)
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      {/* 쿼리가 바뀌면(목록 복귀 등) 입력값을 다시 맞춥니다. */}
      <ProductFilterCard key={JSON.stringify(filters)} filters={filters} onSearch={applyFilters} />
      <ProductTable products={data?.products ?? []} emptyMessage={emptyMessage} />
      <Pagination page={filters.page} totalPages={data?.totalPages ?? 1} onChange={changePage} />
    </div>
  );
}
