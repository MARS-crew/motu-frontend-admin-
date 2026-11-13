import { Link, useLocation } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { AbnormalTradeStatusBadge } from '@/components/monitoring/AbnormalTradeStatusBadge';
import { ABNORMAL_TRADE_TYPE_LABELS } from '@/constants/monitoring';
import { getMonitoringDetailPath } from '@/constants/routes';
import type { AbnormalTradeSummary } from '@/types/monitoring';
import { formatMonthDayTime } from '@/utils/date';

type AbnormalTradeTableProps = {
  trades: AbnormalTradeSummary[];
};

// ADM-MON-01 이상 거래·주문 처리 실패 목록 (발생일시·탐지 유형·상품·회원·오류·처리 상태)
export function AbnormalTradeTable({ trades }: AbnormalTradeTableProps) {
  // 상세에서 목록으로 돌아올 때 조회 조건을 유지하려고 현재 쿼리를 넘깁니다.
  const { search } = useLocation();

  const columns: TableColumn<AbnormalTradeSummary>[] = [
    {
      id: 'detectedAt',
      header: '발생일시',
      cell: (row) => formatMonthDayTime(row.detectedAt),
      isEmphasized: true,
    },
    { id: 'type', header: '탐지 유형', cell: (row) => ABNORMAL_TRADE_TYPE_LABELS[row.type] },
    { id: 'productId', header: '상품', cell: (row) => row.productId },
    { id: 'memberId', header: '회원', cell: (row) => row.memberId },
    { id: 'errorMessage', header: '오류 내용', cell: (row) => row.errorMessage },
    {
      id: 'status',
      header: '처리 상태',
      cell: (row) => <AbnormalTradeStatusBadge status={row.status} />,
    },
    {
      id: 'action',
      header: '작업',
      cell: (row) => (
        <Link
          to={getMonitoringDetailPath(row.alertId)}
          state={{ listSearch: search }}
          className={buttonClassName({ variant: 'secondary', size: 'sm' })}
        >
          상세
        </Link>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={trades}
      getRowKey={(row) => row.alertId}
      gridClassName="grid-cols-[182fr_182fr_146fr_146fr_219fr_146fr_109fr]"
      emptyMessage="조건에 맞는 이상 거래가 없습니다."
    />
  );
}
