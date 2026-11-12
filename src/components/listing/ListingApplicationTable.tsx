import { Link, useLocation } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { ListingStatusBadge } from '@/components/listing/ListingStatusBadge';
import { LISTING_CATEGORY_LABELS, REVIEWED_LISTING_STATUSES } from '@/constants/listing';
import { getListingDetailPath } from '@/constants/routes';
import type { ListingApplicationSummary } from '@/types/listing';
import { formatMonthDay } from '@/utils/date';

type ListingApplicationTableProps = {
  applications: ListingApplicationSummary[];
};

// ADM-LST-01 상장 신청 목록 (상품명·신청자·카테고리·신청일·현재 상태)
export function ListingApplicationTable({ applications }: ListingApplicationTableProps) {
  // 상세에서 [목록으로] 돌아올 때 검색 조건을 유지하려고 현재 쿼리를 넘깁니다.
  const { search } = useLocation();

  const columns: TableColumn<ListingApplicationSummary>[] = [
    { id: 'productName', header: '상품명', cell: (row) => row.productName, isEmphasized: true },
    { id: 'applicant', header: '신청자', cell: (row) => row.applicantName },
    { id: 'category', header: '카테고리', cell: (row) => LISTING_CATEGORY_LABELS[row.category] },
    { id: 'appliedAt', header: '신청일', cell: (row) => formatMonthDay(row.appliedAt) },
    { id: 'status', header: '상태', cell: (row) => <ListingStatusBadge status={row.status} /> },
    {
      id: 'action',
      header: '작업',
      cell: (row) => (
        <Link
          to={getListingDetailPath(row.applicationId)}
          state={{ listSearch: search }}
          className={buttonClassName({ variant: 'secondary', size: 'sm' })}
        >
          {REVIEWED_LISTING_STATUSES.includes(row.status) ? '상세 보기' : '상세 심사'}
        </Link>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={applications}
      getRowKey={(row) => row.applicationId}
      gridClassName="grid-cols-[1.5fr_repeat(5,1fr)]"
      emptyMessage="조건에 맞는 상장 신청이 없습니다."
    />
  );
}
