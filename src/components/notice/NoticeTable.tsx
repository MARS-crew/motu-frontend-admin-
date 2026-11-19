import { useNavigate } from 'react-router';

import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { NoticeStatusBadge } from '@/components/notice/NoticeStatusBadge';
import { ALL_MEMBERS_TARGET_LABEL, NOTICE_TYPE_LABELS } from '@/constants/notice';
import { getNoticeEditPath } from '@/constants/routes';
import type { NoticeSummary } from '@/types/notice';
import { formatMonthDay } from '@/utils/date';

type NoticeTableProps = {
  notices: NoticeSummary[];
  // 조회 중·조회 실패 안내 (없으면 '조건에 맞는 공지가 없습니다.')
  emptyMessage?: string;
};

// 09.03~09.10 (기간이 없으면 -)
const formatNoticePeriod = ({ startAt, endAt }: NoticeSummary) =>
  startAt && endAt
    ? `${formatMonthDay(startAt.slice(0, 10))}~${formatMonthDay(endAt.slice(0, 10))}`
    : '-';

// ADM-NTC-01 공지 목록 (행을 누르면 공지 수정 화면으로 이동)
export function NoticeTable({
  notices,
  emptyMessage = '조건에 맞는 공지가 없습니다.',
}: NoticeTableProps) {
  const navigate = useNavigate();

  const columns: TableColumn<NoticeSummary>[] = [
    { id: 'type', header: '구분', cell: (row) => NOTICE_TYPE_LABELS[row.type], isEmphasized: true },
    { id: 'title', header: '제목', cell: (row) => row.title },
    {
      id: 'target',
      header: '게시 대상',
      cell: (row) => row.productName ?? row.productCode ?? ALL_MEMBERS_TARGET_LABEL,
    },
    { id: 'status', header: '상태', cell: (row) => <NoticeStatusBadge status={row.status} /> },
    { id: 'period', header: '게시 기간', cell: formatNoticePeriod },
  ];

  return (
    <Table
      columns={columns}
      rows={notices}
      getRowKey={(row) => row.noticeId}
      gridClassName="grid-cols-[1fr_4fr_2fr_1.5fr_2fr]"
      emptyMessage={emptyMessage}
      onRowClick={(row) => void navigate(getNoticeEditPath(row.noticeId))}
    />
  );
}
