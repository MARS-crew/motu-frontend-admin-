import { ListingApplicationTable } from '@/components/listing/ListingApplicationTable';
import { ListingFilterCard } from '@/components/listing/ListingFilterCard';
import { LISTING_APPLICATIONS_PREVIEW } from '@/constants/listingPreview';
import { useListingFilters } from '@/hooks/useListingFilters';
import type { ListingApplicationFilters, ListingApplicationSummary } from '@/types/listing';

// TODO(MOTU-20-1): 서버 검색·정렬·페이징으로 교체합니다.
// 퍼블리싱 확인용으로 예시 데이터를 상태·신청자·카테고리로만 거릅니다.
const filterPreview = (
  applications: ListingApplicationSummary[],
  filters: ListingApplicationFilters,
) =>
  applications.filter(
    (application) =>
      (filters.status === 'ALL' || application.status === filters.status) &&
      (filters.category === 'ALL' || application.category === filters.category) &&
      application.applicantName.includes(filters.applicant.trim()),
  );

// ADM-LST-01 상장 신청 목록
export default function ListingsPage() {
  const { filters, applyFilters } = useListingFilters();
  const applications = filterPreview(LISTING_APPLICATIONS_PREVIEW, filters);

  return (
    <div className="flex flex-col gap-5">
      {/* 쿼리가 바뀌면(목록 복귀 등) 입력값을 다시 맞춥니다. */}
      <ListingFilterCard key={JSON.stringify(filters)} filters={filters} onSearch={applyFilters} />
      <ListingApplicationTable applications={applications} />
    </div>
  );
}
