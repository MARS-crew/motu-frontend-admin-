import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Notice } from '@/components/common/Notice';
import { RevisionDeadlineModal } from '@/components/listing/RevisionDeadlineModal';
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
import { getListingReviewPath } from '@/constants/routes';
import { useListingListPath } from '@/hooks/useListingListPath';
import { useListingApplicationQuery } from '@/queries/useListingApplicationQuery';
import { useStartListingReviewMutation } from '@/queries/useListingReviewMutations';
import { formatDateTimeText } from '@/utils/date';
import type { ListingDetailTab } from '@/types/listing';
import { getApiErrorMessage } from '@/utils/apiError';

const isListingDetailTab = (value: string | null): value is ListingDetailTab =>
  LISTING_DETAIL_TABS.some((tab) => tab.value === value);

// ADM-LST-02 상장 신청 상세 심사 (기본 정보 · 평가·거래 · 서비스 지표 · 증빙 자료 탭)
export default function ListingDetailPage() {
  const { applicationId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { listPath, locationState } = useListingListPath();
  const navigate = useNavigate();
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const startReview = useStartListingReviewMutation(Number(applicationId));
  const {
    data: application,
    isPending,
    isError,
    error,
  } = useListingApplicationQuery(Number(applicationId));

  const tabParam = searchParams.get('tab');
  const tab = isListingDetailTab(tabParam) ? tabParam : DEFAULT_LISTING_DETAIL_TAB;
  // 탭은 쿼리로 관리하되, 목록 검색 조건(state)은 그대로 넘깁니다.
  const handleChangeTab = (value: ListingDetailTab) =>
    setSearchParams({ tab: value }, { replace: true, state: locationState });

  if (isError) return <PlaceholderSection description={getApiErrorMessage(error)} />;
  if (isPending) {
    return (
      <PlaceholderSection
        description={
          Number(applicationId) > 0
            ? '상장 신청을 불러오는 중입니다.'
            : '상장 신청을 찾을 수 없습니다.'
        }
      />
    );
  }

  const canReview = !REVIEWED_LISTING_STATUSES.includes(application.status);
  const { pendingRevision } = application;

  // 접수 상태는 검토 시작 API 가 성공한 뒤 심사 처리 화면으로 이동합니다. 이미 검토중이면 바로 이동합니다.
  // 다른 관리자가 먼저 처리했다면 실패 안내를 보여주고, 상세는 최신 상태로 다시 불러옵니다.
  const handleOpenReview = () => {
    const reviewPath = getListingReviewPath(String(application.id));
    if (application.status !== 'SUBMITTED') {
      void navigate(reviewPath, { state: locationState });
      return;
    }
    startReview.mutate(undefined, {
      onSuccess: () => void navigate(reviewPath, { state: locationState }),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <ListingDetailHeader
        applicationNumber={application.applicationNumber}
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
          <ListingSummaryCard
            application={application}
            className="flex-1"
            hasImage={tab === 'basic'}
          />
          {tab === 'basic' && <ListingBasicInfoCard application={application} />}
          {tab === 'trading' && <ListingTradingCard application={application} />}
          {tab === 'metrics' && <ListingMetricsCard application={application} />}
        </div>
      )}

      {pendingRevision && (
        <Notice>
          보완 요청 · {pendingRevision.requestItems.join(', ')} · 기한{' '}
          {formatDateTimeText(pendingRevision.deadline)} (KST) · 재제출 대기
        </Notice>
      )}

      {startReview.error && <Notice tone="danger">{getApiErrorMessage(startReview.error)}</Notice>}

      {canReview && (
        <div className="flex justify-end gap-2">
          {/* 보완 요청 · 미재제출 회차에서만 표시합니다. */}
          {pendingRevision && (
            <Button variant="secondary" onClick={() => setIsExtendOpen(true)}>
              보완 기한 연장
            </Button>
          )}
          <Button disabled={startReview.isPending} onClick={handleOpenReview}>
            심사 결과 처리
          </Button>
        </div>
      )}

      {pendingRevision && (
        <RevisionDeadlineModal
          isOpen={isExtendOpen}
          applicationId={application.id}
          revision={pendingRevision}
          onClose={() => setIsExtendOpen(false)}
        />
      )}
    </div>
  );
}
