import { Link } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { MemberStatusBadge } from '@/components/member/MemberStatusBadge';
import { getMemberDetailPath } from '@/constants/routes';
import type { MemberSummary } from '@/types/member';
import { formatMonthDayTime, formatShortDate } from '@/utils/date';

type MemberTableProps = {
  members: MemberSummary[];
  // 상세에서 [목록으로] 돌아올 때 검색 조건을 유지하도록 넘깁니다.
  listSearch: string;
};

// ADM-MBR-01 회원 목록 (아이디·닉네임·마스킹 이메일·가입일·상태·최근 접속)
export function MemberTable({ members, listSearch }: MemberTableProps) {
  const columns: TableColumn<MemberSummary>[] = [
    { id: 'loginId', header: '아이디', cell: (row) => row.loginId, isEmphasized: true },
    { id: 'nickname', header: '닉네임', cell: (row) => row.nickname },
    { id: 'email', header: '이메일', cell: (row) => row.maskedEmail },
    { id: 'joinedAt', header: '가입일', cell: (row) => formatShortDate(row.joinedAt) },
    { id: 'status', header: '상태', cell: (row) => <MemberStatusBadge status={row.status} /> },
    { id: 'lastLoginAt', header: '최근 접속', cell: (row) => formatMonthDayTime(row.lastLoginAt) },
    {
      id: 'action',
      header: '상세',
      cell: (row) => (
        <Link
          to={getMemberDetailPath(row.memberId)}
          state={{ listSearch }}
          className={buttonClassName({ variant: 'secondary', size: 'sm' })}
        >
          보기
        </Link>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={members}
      getRowKey={(row) => row.memberId}
      gridClassName="grid-cols-[2fr_1.5fr_2.5fr_1.5fr_1.2fr_1.8fr_1fr]"
      emptyMessage="조건에 맞는 회원이 없습니다."
    />
  );
}
