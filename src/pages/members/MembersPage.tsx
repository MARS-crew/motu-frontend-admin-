import { useLocation } from 'react-router';

import { PageHeading } from '@/components/common/PageHeading';
import { Pagination } from '@/components/common/Pagination';
import { MemberFilterCard } from '@/components/member/MemberFilterCard';
import { MemberTable } from '@/components/member/MemberTable';
import { MEMBER_PAGE_SIZE } from '@/constants/member';
import { MEMBERS_PREVIEW } from '@/constants/memberPreview';
import { useMemberFilters } from '@/hooks/useMemberFilters';
import type { MemberFilters, MemberSummary } from '@/types/member';

// TODO(MOTU-27-1): 서버 검색·페이지네이션으로 교체합니다. 퍼블리싱 확인용으로 예시 데이터를 거릅니다.
const filterPreview = (members: MemberSummary[], filters: MemberFilters) => {
  const loginId = filters.loginId.trim().toLowerCase();
  const nickname = filters.nickname.trim().toLowerCase();
  return members.filter(
    (member) =>
      (!loginId || member.loginId.toLowerCase().includes(loginId)) &&
      (!nickname || member.nickname.toLowerCase().includes(nickname)) &&
      (filters.status === 'ALL' || member.status === filters.status),
  );
};

// ADM-MBR-01 회원 목록 (가입일 최신순, 한 페이지 10명)
export default function MembersPage() {
  const location = useLocation();
  const { filters, applyFilters, changePage } = useMemberFilters();

  const filtered = filterPreview(MEMBERS_PREVIEW, filters);
  const totalPages = Math.max(Math.ceil(filtered.length / MEMBER_PAGE_SIZE), 1);
  const page = Math.min(filters.page, totalPages);
  const members = filtered.slice((page - 1) * MEMBER_PAGE_SIZE, page * MEMBER_PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="회원 목록" />
      <MemberFilterCard key={JSON.stringify(filters)} filters={filters} onSearch={applyFilters} />
      <MemberTable members={members} listSearch={location.search} />
      <Pagination page={page} totalPages={totalPages} onChange={changePage} />
    </div>
  );
}
