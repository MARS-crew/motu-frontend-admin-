import type {
  ListingApplicationDetail,
  ListingApplicationFilters,
  ListingApplicationResponse,
  ListingApplicationsParams,
  ListingAttachment,
  ListingAttachmentCollection,
  ListingEvidenceFile,
} from '@/types/listing';
import {
  addDays,
  formatDateTimeText,
  parseISODate,
  toISODate,
  toKSTStartOfDay,
} from '@/utils/date';
import { formatFileSize, formatNumber } from '@/utils/format';

// 화면 검색 조건 → 목록 API 파라미터
// 신청 기간 종료일은 그날 하루를 포함하도록 다음 날 자정(미포함)으로 보냅니다.
export const toListingApplicationsParams = (
  filters: ListingApplicationFilters,
  size: number,
): ListingApplicationsParams => {
  const appliedTo = parseISODate(filters.appliedTo);
  return {
    status: filters.status === 'ALL' ? undefined : filters.status,
    applicant: filters.applicant.trim() || undefined,
    sectorCode: filters.sectorCode === 'ALL' ? undefined : Number(filters.sectorCode),
    from: filters.appliedFrom ? toKSTStartOfDay(filters.appliedFrom) : undefined,
    to: appliedTo ? toKSTStartOfDay(toISODate(addDays(appliedTo, 1))) : undefined,
    page: filters.page,
    size,
  };
};

const TRANSACTION_BASIS_LABELS: Record<string, string> = {
  LAST_12_MONTHS: '거래액 (최근 완료 12개월)',
  SINCE_LAUNCH: '거래액 (운영 전체 기간)',
};

// 신청서 숫자 입력값('12,000')을 숫자로 바꿉니다. 비었거나 숫자가 아니면 null
const toNumber = (value: string | null | undefined) => {
  if (!value?.trim()) return null;
  const number = Number(value.replaceAll(',', ''));
  return Number.isFinite(number) ? number : null;
};

const textOrNull = (value: string | null | undefined) => value?.trim() || null;

// 숫자면 천 단위 쉼표 + 단위, 숫자가 아니면 입력값 그대로
const formatAmount = (value: string | null | undefined, unit: string) => {
  const number = toNumber(value);
  if (number !== null) return `${formatNumber(number)}${unit}`;
  return textOrNull(value);
};

// 2025-01-01, 2025-12-31 → 2025.01.01–2025.12.31
const formatPeriod = (start?: string | null, end?: string | null) =>
  start && end ? `${formatDateTimeText(start)}–${formatDateTimeText(end)}` : null;

// 출처 · 추출일
const joinSource = (source?: string | null, date?: string | null) => {
  const parts = [textOrNull(source), date ? formatDateTimeText(date) : null].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : null;
};

// 지표 값 + 기준 시점: 120,000명 (2026-08 기준)
const withReference = (value: string | null, reference?: string | null) =>
  value && reference ? `${value} (${formatDateTimeText(reference)} 기준)` : value;

const toEvidenceFile = (
  attachment: ListingAttachment,
  description: string,
): ListingEvidenceFile => ({
  attachmentId: attachment.id,
  kind: attachment.kind,
  fileName:
    attachment.kind === 'LINK'
      ? (attachment.url ?? '외부 링크')
      : (attachment.originalName ?? '이름 없는 파일'),
  description,
  contentType: attachment.contentType ?? null,
  sizeLabel: attachment.size ? formatFileSize(attachment.size) : '-',
  url: attachment.url ?? null,
});

// 저장이 끝난 첨부만 보여줍니다.
const toEvidenceFiles = (collection: ListingAttachmentCollection | null, fallback = '') =>
  (collection?.attachments ?? [])
    .filter((attachment) => attachment.saved)
    .map((attachment) => toEvidenceFile(attachment, collection?.description ?? fallback));

// 상세 API 응답 → 상세 화면 표시용
export const toListingApplicationDetail = (
  response: ListingApplicationResponse,
): ListingApplicationDetail => {
  const { data } = response;
  const mainImage =
    toEvidenceFiles(response.attachments.mainImage).find((file) => file.kind === 'FILE') ?? null;

  return {
    id: response.id,
    applicationNumber: response.applicationNumber,
    applicantName: response.applicant.nickname,
    status: response.status,
    serviceName: response.serviceName ?? textOrNull(data.serviceName),
    sectorName: response.sectorName,
    operatorName: textOrNull(data.operatorName),
    officialUrl: textOrNull(data.officialUrl),
    mainImage,
    summary: textOrNull(data.summary),
    description: textOrNull(data.description),
    managerName: textOrNull(data.managerName),
    managerEmail: textOrNull(data.businessEmail),
    managerPhone: textOrNull(data.contactPhone),
    desiredPrice: toNumber(data.desiredPrice),
    totalSupply: toNumber(data.totalIssuedQuantity),
    minOrderQuantity: toNumber(data.minOrderQuantity),
    tickSize: toNumber(data.tickSize),
    priceBasis: textOrNull(data.priceCalculationBasis),
    metrics: {
      mau: withReference(formatAmount(data.mau, '명'), data.mauReferenceMonth),
      dau: withReference(formatAmount(data.dau, '명'), data.dauReferenceDate),
      annualRevenue: formatAmount(data.revenue, '원'),
      revenuePeriod: formatPeriod(data.revenueStartDate, data.revenueEndDate),
      revenueSource: joinSource(data.revenueSource, data.revenueExtractDate),
      transactionLabel:
        TRANSACTION_BASIS_LABELS[data.transactionVolumeBasis ?? 'LAST_12_MONTHS'] ?? '거래액',
      transactionAmount: formatAmount(data.transactionVolume, '원'),
      transactionPeriod: formatPeriod(data.metricsStartDate, data.metricsEndDate),
      transactionSource: joinSource(
        data.transactionVolumeSource,
        data.transactionVolumeExtractDate,
      ),
    },
    evidences: toEvidenceFiles(response.attachments.evidence, data.evidenceDescription ?? ''),
  };
};
