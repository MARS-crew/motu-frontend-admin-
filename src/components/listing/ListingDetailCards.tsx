import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { InfoCard } from '@/components/common/InfoCard';
import { InfoRow } from '@/components/common/InfoRow';
import { EvidencePreviewModal } from '@/components/listing/EvidencePreviewModal';
import { PriceBasisModal } from '@/components/listing/PriceBasisModal';
import { NOT_SUBMITTED_LABEL } from '@/constants/listing';
import { useObjectUrl } from '@/hooks/useObjectUrl';
import {
  getListingAttachmentQueryOptions,
  useListingAttachmentQuery,
} from '@/queries/useListingAttachmentQuery';
import { openExternalLink, saveBlob } from '@/utils/file';
import type { ListingApplicationDetail, ListingEvidenceFile } from '@/types/listing';
import { formatNumber } from '@/utils/format';

type ListingCardProps = {
  application: ListingApplicationDetail;
};

const orNotSubmitted = (value: string | null) => value ?? NOT_SUBMITTED_LABEL;
const formatOrNotSubmitted = (value: number | null, unit: string) =>
  value === null ? NOT_SUBMITTED_LABEL : `${formatNumber(value)}${unit}`;

type ListingSummaryCardProps = ListingCardProps & {
  className?: string;
  // 기본 정보 탭에서는 대표 이미지 썸네일까지 보여줍니다.
  hasImage?: boolean;
};

// 모든 탭에서 유지하는 상품 요약
export function ListingSummaryCard({
  application,
  className,
  hasImage = false,
}: ListingSummaryCardProps) {
  return (
    <InfoCard
      title="상품 요약"
      className={className}
      items={[
        { label: '상품명', value: orNotSubmitted(application.serviceName) },
        { label: '카테고리', value: orNotSubmitted(application.sectorName) },
        { label: '운영사', value: orNotSubmitted(application.operatorName) },
        { label: '공식 URL', value: orNotSubmitted(application.officialUrl) },
      ]}
    >
      {hasImage && (
        <div className="flex items-start justify-between gap-4">
          <p className="text-body-sm font-medium text-motu-text-tertiary">대표 이미지</p>
          <ListingMainImage application={application} />
        </div>
      )}
    </InfoCard>
  );
}

// 대표 이미지 썸네일 (인증이 필요한 파일이라 받아서 표시합니다)
function ListingMainImage({ application }: ListingCardProps) {
  const attachmentId = application.mainImage?.attachmentId ?? null;
  const { data } = useListingAttachmentQuery(application.id, attachmentId);
  const imageUrl = useObjectUrl(data);
  const name = application.serviceName ?? '상품';

  return (
    <div className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-motu-border bg-motu-bg-secondary p-1 text-center text-label-sm font-medium text-motu-text-tertiary">
      {imageUrl ? (
        <img src={imageUrl} alt={`${name} 대표 이미지`} className="size-full object-cover" />
      ) : attachmentId ? (
        '불러오는 중'
      ) : (
        NOT_SUBMITTED_LABEL
      )}
    </div>
  );
}

// ADM-LST-02-01 기본 정보 탭 (읽기 전용, 신청서 상세 + 운영·담당자 정보)
export function ListingBasicInfoCard({ application }: ListingCardProps) {
  return (
    <InfoCard
      title="신청서 상세"
      className="flex-1"
      items={[
        { label: '한 줄 소개', value: orNotSubmitted(application.summary) },
        { label: '상세 설명', value: orNotSubmitted(application.description) },
      ]}
    >
      <h3 className="mt-0.5 text-body-md font-bold text-motu-text-primary">운영·담당자 정보</h3>
      <dl className="flex flex-col gap-3.5">
        <InfoRow label="운영사" value={orNotSubmitted(application.operatorName)} />
        <InfoRow label="담당자" value={orNotSubmitted(application.managerName)} />
        <InfoRow label="업무용 이메일" value={orNotSubmitted(application.managerEmail)} />
        <InfoRow label="담당자 연락처" value={orNotSubmitted(application.managerPhone)} />
      </dl>
    </InfoCard>
  );
}

// ADM-LST-02 평가·거래 탭 (가격 근거 [전체 보기]는 원문 모달)
export function ListingTradingCard({ application }: ListingCardProps) {
  const [isPriceBasisOpen, setIsPriceBasisOpen] = useState(false);

  return (
    <InfoCard
      title="평가·거래 정보"
      className="flex-1"
      items={[
        { label: '희망 상장가', value: formatOrNotSubmitted(application.desiredPrice, 'P') },
        { label: '총 발행량', value: formatOrNotSubmitted(application.totalSupply, '주') },
        {
          label: '최소 주문 / 호가',
          value: `${formatOrNotSubmitted(application.minOrderQuantity, '주')} / ${formatOrNotSubmitted(application.tickSize, 'P')}`,
        },
      ]}
    >
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-medium text-motu-text-tertiary">가격 근거</span>
        <Button variant="secondary" size="sm" onClick={() => setIsPriceBasisOpen(true)}>
          전체 보기
        </Button>
      </div>
      <PriceBasisModal
        isOpen={isPriceBasisOpen}
        onClose={() => setIsPriceBasisOpen(false)}
        applicationNumber={application.applicationNumber}
        productName={application.serviceName ?? '-'}
        priceBasis={orNotSubmitted(application.priceBasis)}
      />
    </InfoCard>
  );
}

// ADM-LST-02-02 서비스 지표 탭 (비어 있으면 '미제출')
export function ListingMetricsCard({ application }: ListingCardProps) {
  const { metrics } = application;

  return (
    <InfoCard
      title="제출 지표"
      className="flex-1"
      items={[
        { label: 'MAU', value: orNotSubmitted(metrics.mau) },
        { label: 'DAU', value: orNotSubmitted(metrics.dau) },
        { label: '연간 매출', value: orNotSubmitted(metrics.annualRevenue) },
        { label: '매출 기간', value: orNotSubmitted(metrics.revenuePeriod) },
        { label: '매출 출처 · 추출일', value: orNotSubmitted(metrics.revenueSource) },
        { label: metrics.transactionLabel, value: orNotSubmitted(metrics.transactionAmount) },
        { label: '거래액 기간', value: orNotSubmitted(metrics.transactionPeriod) },
        { label: '거래액 출처 · 추출일', value: orNotSubmitted(metrics.transactionSource) },
      ]}
    />
  );
}

// ADM-LST-02-03 증빙 자료 탭 (제출 파일 표: 파일명·크기, 미리보기·다운로드)
export function ListingEvidenceCard({ application }: ListingCardProps) {
  const [previewFile, setPreviewFile] = useState<ListingEvidenceFile | null>(null);
  const { evidences } = application;

  const queryClient = useQueryClient();

  // 파일은 원본 파일명으로 내려받고, 외부 링크는 새 탭으로 엽니다.
  const handleDownload = async (file: ListingEvidenceFile) => {
    if (file.kind === 'LINK') {
      if (file.url) openExternalLink(file.url);
      return;
    }
    const blob = await queryClient.fetchQuery(
      getListingAttachmentQueryOptions(application.id, file.attachmentId),
    );
    saveBlob(blob, file.fileName);
  };

  return (
    <section className="flex flex-col gap-3.5 rounded-[14px] border border-motu-border bg-white px-6 py-5">
      <div className="flex items-center gap-2">
        <h2 className="text-title-md font-bold text-motu-text-primary">제출 파일</h2>
        <p className="text-body-sm font-medium text-motu-text-secondary">{evidences.length}개</p>
      </div>
      {evidences.length === 0 ? (
        <p className="text-body-sm font-medium text-motu-text-tertiary">
          첨부된 증빙 자료가 없습니다.
        </p>
      ) : (
        <div role="table" className="overflow-hidden rounded-lg border border-motu-border">
          <div
            role="row"
            className="flex h-10 items-center gap-4 bg-motu-bg-secondary px-4 text-center text-body-sm font-medium text-motu-text-secondary"
          >
            <span role="columnheader" className="min-w-0 flex-1">
              파일명
            </span>
            <span role="columnheader" className="w-40 shrink-0">
              크기
            </span>
            <span role="columnheader" className="w-[180px] shrink-0">
              파일 작업
            </span>
          </div>
          {evidences.map((file) => (
            <div
              key={file.attachmentId}
              role="row"
              className="flex h-14 items-center gap-4 border-t border-motu-border px-4 text-center"
            >
              <span
                role="cell"
                className="min-w-0 flex-1 truncate text-body-md font-bold text-motu-text-primary"
              >
                {file.fileName}
              </span>
              <span
                role="cell"
                className="w-40 shrink-0 text-body-sm font-medium text-motu-text-secondary"
              >
                {file.sizeLabel}
              </span>
              <span role="cell" className="flex w-[180px] shrink-0 justify-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setPreviewFile(file)}>
                  미리보기
                </Button>
                <Button variant="secondary" size="sm" onClick={() => void handleDownload(file)}>
                  {file.kind === 'LINK' ? '링크 열기' : '다운로드'}
                </Button>
              </span>
            </div>
          ))}
        </div>
      )}
      <EvidencePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        applicationId={application.id}
        applicationNumber={application.applicationNumber}
        onDownload={(file) => void handleDownload(file)}
      />
    </section>
  );
}
