import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { InfoCard } from '@/components/common/InfoCard';
import { EvidencePreviewModal } from '@/components/listing/EvidencePreviewModal';
import { PriceBasisModal } from '@/components/listing/PriceBasisModal';
import { NOT_SUBMITTED_LABEL } from '@/constants/listing';
import type { ListingApplicationDetail, ListingEvidenceFile } from '@/types/listing';
import { formatNumber } from '@/utils/format';

type ListingCardProps = {
  application: ListingApplicationDetail;
};

const orNotSubmitted = (value: string | null) => value ?? NOT_SUBMITTED_LABEL;

// 모든 탭에서 유지하는 상품 요약
export function ListingSummaryCard({
  application,
  className,
}: ListingCardProps & { className?: string }) {
  return (
    <InfoCard
      title="상품 요약"
      className={className}
      items={[
        { label: '상품명', value: application.productName },
        { label: '카테고리', value: application.categoryDetail },
        { label: '운영사', value: application.operatorName },
        { label: '공식 URL', value: application.officialUrl },
      ]}
    />
  );
}

// ADM-LST-02-01 기본 정보 탭 (읽기 전용)
export function ListingBasicInfoCard({ application }: ListingCardProps) {
  return (
    <InfoCard
      title="신청 기본 정보"
      className="flex-1"
      items={[
        { label: '한 줄 소개', value: application.oneLineIntro },
        { label: '상세 설명', value: application.description },
        { label: '대표 이미지', value: application.imageFileName },
        { label: '운영사', value: application.operatorName },
        { label: '담당자', value: application.managerName },
        { label: '업무 이메일', value: application.managerEmail },
        { label: '연락처', value: application.managerPhone },
      ]}
    />
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
        { label: '희망 상장가', value: `${formatNumber(application.desiredPrice)}P` },
        { label: '총 발행량', value: `${formatNumber(application.totalSupply)}주` },
        {
          label: '최소 주문 / 호가',
          value: `${formatNumber(application.minOrderQuantity)}주 / ${formatNumber(application.tickSize)}P`,
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
        applicationId={application.applicationId}
        productName={application.productName}
        priceBasis={application.priceBasis}
      />
    </InfoCard>
  );
}

// ADM-LST-02-02 서비스 지표 탭 (비어 있으면 '미제출')
export function ListingMetricsCard({ application }: ListingCardProps) {
  const { metrics } = application;
  const formatPeople = (value: number | null) =>
    value === null ? NOT_SUBMITTED_LABEL : `${formatNumber(value)}명`;

  return (
    <InfoCard
      title="제출 지표"
      className="flex-1"
      items={[
        { label: 'MAU', value: formatPeople(metrics.mau) },
        { label: 'DAU', value: formatPeople(metrics.dau) },
        { label: '연간 매출', value: orNotSubmitted(metrics.annualRevenue) },
        { label: '매출 기간', value: orNotSubmitted(metrics.revenuePeriod) },
        { label: '매출 출처 · 추출일', value: orNotSubmitted(metrics.revenueSource) },
        { label: '거래액 (최근 완료 12개월)', value: orNotSubmitted(metrics.transactionAmount) },
        { label: '거래액 기간', value: orNotSubmitted(metrics.transactionPeriod) },
        { label: '거래액 출처 · 추출일', value: orNotSubmitted(metrics.transactionSource) },
      ]}
    />
  );
}

// ADM-LST-02-03 증빙 자료 탭 (파일명·크기, 미리보기·다운로드)
export function ListingEvidenceCard({ application }: ListingCardProps) {
  const [previewFile, setPreviewFile] = useState<ListingEvidenceFile | null>(null);

  // TODO(MOTU-21-1): 원본 파일명으로 다운로드
  const handleDownload = (file: ListingEvidenceFile) => void file;

  return (
    <InfoCard title="증빙 자료">
      {application.evidences.length === 0 ? (
        <p className="text-body-sm font-medium text-motu-text-tertiary">
          첨부된 증빙 자료가 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {application.evidences.map((file) => (
            <li key={file.fileId} className="flex items-center gap-2">
              <span className="text-title-md font-bold text-motu-text-primary">
                {file.fileName}
              </span>
              <span className="min-w-0 flex-1 truncate text-body-sm font-medium text-motu-text-secondary">
                {file.description} · {file.sizeLabel}
              </span>
              <Button variant="secondary" size="sm" onClick={() => setPreviewFile(file)}>
                미리보기
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleDownload(file)}>
                다운로드
              </Button>
            </li>
          ))}
        </ul>
      )}
      <EvidencePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
      />
    </InfoCard>
  );
}
