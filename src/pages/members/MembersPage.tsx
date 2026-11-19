import { Link, useLocation } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import { PageHeading } from '@/components/common/PageHeading';
import { Pagination } from '@/components/common/Pagination';
import { MemberFilterCard } from '@/components/member/MemberFilterCard';
import { MemberTable } from '@/components/member/MemberTable';
import { ROUTES } from '@/constants/routes';
import { useMemberFilters } from '@/hooks/useMemberFilters';
import { useMembersQuery } from '@/queries/useMembersQuery';
import { getApiErrorMessage } from '@/utils/apiError';

// ADM-MBR-01 회원 목록 (가입일 최신순, 한 페이지 10명)
// TODO(MOTU-27-1): 엑셀 다운로드는 API 가 없어 아직 제공하지 않습니다.
export default function MembersPage() {
  const location = useLocation();
  const { filters, applyFilters, changePage } = useMemberFilters();
  const { data, isPending, isError, error } = useMembersQuery(filters);

  const emptyMessage = isPending
    ? '회원을 불러오는 중입니다.'
    : isError
      ? getApiErrorMessage(error)
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="회원 목록" />
      <MemberFilterCard key={JSON.stringify(filters)} filters={filters} onSearch={applyFilters} />
      <MemberTable
        members={data?.members ?? []}
        listSearch={location.search}
        emptyMessage={emptyMessage}
      />
      <Pagination page={filters.page} totalPages={data?.totalPages ?? 1} onChange={changePage} />
      <div className="flex justify-end">
        <Link
          to={ROUTES.MEMBER_INITIAL_POINTS}
          className={buttonClassName({ variant: 'secondary' })}
        >
          초기 지급 포인트 설정
        </Link>
      </div>
    </div>
  );
}
