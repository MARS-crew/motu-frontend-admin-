import { useState } from 'react';

import { InfoCard } from '@/components/common/InfoCard';
import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { LISTING_CATEGORY_LABELS } from '@/constants/listing';
import { NOT_REGISTERED_LABEL, PRODUCT_EXPOSURE_LABELS } from '@/constants/product';
import type { ProductDetail, ProductHistory } from '@/types/product';
import { formatDateTimeText, formatMonthDayTime } from '@/utils/date';
import { formatNumber } from '@/utils/format';

type ProductCardProps = {
  product: ProductDetail;
};

// ADM-PRD-02 기본 정보 탭 (상품 기본 정보 + 거래 정보)
export function ProductBasicInfoCards({ product }: ProductCardProps) {
  return (
    <div className="flex items-stretch gap-5">
      <InfoCard
        title="상품 기본 정보"
        className="flex-1"
        items={[
          { label: '상품명', value: product.productName },
          {
            label: '카테고리',
            value: product.categoryDetail || LISTING_CATEGORY_LABELS[product.category],
          },
          { label: '운영사', value: product.operatorName },
          { label: '노출 상태', value: PRODUCT_EXPOSURE_LABELS[product.exposure] },
          { label: '공식 URL', value: product.officialUrl },
          { label: '상품 소개', value: product.intro },
        ]}
      />
      <InfoCard
        title="거래 정보"
        className="flex-1"
        items={[
          {
            label: '현재가',
            value: product.currentPrice === null ? '-' : `${formatNumber(product.currentPrice)}P`,
          },
          { label: '총 발행량', value: formatNumber(product.totalSupply) },
          { label: '거래 시작', value: formatDateTimeText(product.tradeStartAt) },
          { label: '미체결 주문', value: `${formatNumber(product.openOrderCount)}건` },
          { label: '거래 상태', value: product.tradeStatusDescription },
        ]}
      />
    </div>
  );
}

// ADM-PRD-02-02 서비스 지표 탭 (값이 없으면 '미등록')
export function ProductMetricsCard({ product }: ProductCardProps) {
  const { metrics } = product;

  return (
    <InfoCard
      title="등록된 서비스 지표"
      items={[
        {
          label: 'MAU',
          value: metrics.mau === null ? NOT_REGISTERED_LABEL : `${formatNumber(metrics.mau)}명`,
        },
        {
          label: '거래액',
          value:
            metrics.transactionAmount === null
              ? NOT_REGISTERED_LABEL
              : formatNumber(metrics.transactionAmount),
        },
        {
          label: '지표 기준일',
          value: metrics.baseDate ? formatDateTimeText(metrics.baseDate) : NOT_REGISTERED_LABEL,
        },
      ]}
    />
  );
}

// ADM-PRD-02-01 변경 이력 탭 (최신순, 행 선택 시 변경 전·후 값과 사유)
export function ProductHistorySection({ product }: ProductCardProps) {
  const [selectedId, setSelectedId] = useState(product.histories[0]?.historyId ?? null);
  const selected = product.histories.find((history) => history.historyId === selectedId);

  const columns: TableColumn<ProductHistory>[] = [
    {
      id: 'processedAt',
      header: '처리 시각',
      cell: (row) => formatMonthDayTime(row.processedAt),
      isEmphasized: true,
    },
    { id: 'actionType', header: '작업', cell: (row) => row.actionType },
    { id: 'adminId', header: '처리자', cell: (row) => row.adminId },
    { id: 'summary', header: '변경 요약', cell: (row) => row.summary, isEmphasized: true },
  ];

  return (
    <>
      <Table
        columns={columns}
        rows={product.histories}
        getRowKey={(row) => row.historyId}
        gridClassName="grid-cols-[1fr_1fr_1fr_2.2fr]"
        emptyMessage="변경 이력이 없습니다."
        onRowClick={(row) => setSelectedId(row.historyId)}
        selectedRowKey={selectedId}
      />
      {selected && (
        <InfoCard
          title="선택 이력 · 변경 전/후 및 사유"
          items={[
            { label: '변경 항목', value: selected.changedField },
            { label: '변경 전', value: selected.before },
            { label: '변경 후', value: selected.after },
            { label: '처리 사유', value: selected.reason },
            {
              label: '처리일시',
              value: `${formatDateTimeText(selected.processedAt)} · ${selected.adminId}`,
            },
          ]}
        />
      )}
    </>
  );
}
