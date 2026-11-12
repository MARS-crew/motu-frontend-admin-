import { Link, useParams, useSearchParams } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import { Chip } from '@/components/common/Chip';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import {
  ListingBasicInfoCard,
  ListingEvidenceCard,
  ListingMetricsCard,
  ListingSummaryCard,
  ListingTradingCard,
} from '@/components/listing/ListingDetailCards';
import { ListingDetailHeader } from '@/components/listing/ListingDetailHeader';
import {
  DEFAULT_LISTING_DETAIL_TAB,
  LISTING_DETAIL_TABS,
  REVIEWED_LISTING_STATUSES,
} from '@/constants/listing';
import { getListingDetailPreview } from '@/constants/listingPreview';
import { getListingReviewPath } from '@/constants/routes';
import { useListingListPath } from '@/hooks/useListingListPath';
import type { ListingDetailTab } from '@/types/listing';

const isListingDetailTab = (value: string | null): value is ListingDetailTab =>
  LISTING_DETAIL_TABS.some((tab) => tab.value === value);

// ADM-LST-02 상장 신청 상세 심사 (기본 정보 · 평가·거래 · 서비스 지표 · 증빙 자료 탭)
export default function ListingDetailPage() {
  const { applicationId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { listPath, locationState } = useListingListPath();

  const tabParam = searchParams.get('tab');
  const tab = isListingDetailTab(tabParam) ? tabParam : DEFAULT_LISTING_DETAIL_TAB;
  // 탭은 쿼리로 관리하되, 목록 검색 조건(state)은 그대로 넘깁니다.
  const handleChangeTab = (value: ListingDetailTab) =>
    setSearchParams({ tab: value }, { replace: true, state: locationState });

  // TODO(MOTU-21-1): 상장 신청 상세 API 연동
  const application = getListingDetailPreview(applicationId);
  if (!application) return <PlaceholderSection description="상장 신청을 찾을 수 없습니다." />;

  const canReview = !REVIEWED_LISTING_STATUSES.includes(application.status);

  return (
    <div className="flex flex-col gap-5">
      <ListingDetailHeader
        applicationId={application.applicationId}
        applicantName={application.applicantName}
        status={application.status}
        listPath={listPath}
      />

      <div role="tablist" aria-label="신청 상세 탭" className="flex gap-2">
        {LISTING_DETAIL_TABS.map((option) => (
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

      {tab === 'evidence' ? (
        <>
          <ListingSummaryCard application={application} />
          <ListingEvidenceCard application={application} />
        </>
      ) : (
        <div className="flex items-stretch gap-5">
          <ListingSummaryCard application={application} className="flex-1" />
          {tab === 'basic' && <ListingBasicInfoCard application={application} />}
          {tab === 'trading' && <ListingTradingCard application={application} />}
          {tab === 'metrics' && <ListingMetricsCard application={application} />}
        </div>
      )}

      {canReview && (
        <div className="flex justify-end">
          <Link
            to={getListingReviewPath(application.applicationId)}
            state={locationState}
            className={buttonClassName()}
          >
            심사 결과 처리
          </Link>
        </div>
      )}
    </div>
  );
}
