import { Pagination } from '@/components/common/Pagination';
import { ListingApplicationTable } from '@/components/listing/ListingApplicationTable';
import { ListingFilterCard } from '@/components/listing/ListingFilterCard';
import { useListingFilters } from '@/hooks/useListingFilters';
import { useListingApplicationsQuery } from '@/queries/useListingApplicationsQuery';
import { getApiErrorMessage } from '@/utils/apiError';

// ADM-LST-01 상장 신청 목록 (최근 접수순, 한 페이지 20건)
export default function ListingsPage() {
  const { filters, applyFilters, changePage } = useListingFilters();
  const { data, isPending, isError, error } = useListingApplicationsQuery(filters);

  const emptyMessage = isPending
    ? '상장 신청을 불러오는 중입니다.'
    : isError
      ? getApiErrorMessage(error)
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      {/* 쿼리가 바뀌면(목록 복귀 등) 입력값을 다시 맞춥니다. */}
      <ListingFilterCard key={JSON.stringify(filters)} filters={filters} onSearch={applyFilters} />
      <ListingApplicationTable
        applications={data?.applications ?? []}
        emptyMessage={emptyMessage}
      />
      <Pagination page={filters.page} totalPages={data?.totalPages ?? 1} onChange={changePage} />
    </div>
  );
}
