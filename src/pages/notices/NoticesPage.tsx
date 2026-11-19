import { Pagination } from '@/components/common/Pagination';
import { NoticeFilterCard } from '@/components/notice/NoticeFilterCard';
import { NoticeTable } from '@/components/notice/NoticeTable';
import { useNoticeFilters } from '@/hooks/useNoticeFilters';
import { useNoticesQuery } from '@/queries/useNoticesQuery';
import { getApiErrorMessage } from '@/utils/apiError';

// ADM-NTC-01 공지 목록 (한 페이지 20건)
// 게시 기간은 선택한 기간과 겹치는 공지를 보여줍니다. 삭제 공지는 '삭제' 상태를 고를 때만 보입니다.
export default function NoticesPage() {
  const { filters, updateFilters, changePage } = useNoticeFilters();
  const { data, isPending, isError, error } = useNoticesQuery(filters);

  const emptyMessage = isPending
    ? '공지를 불러오는 중입니다.'
    : isError
      ? getApiErrorMessage(error)
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      <NoticeFilterCard filters={filters} onChange={updateFilters} />
      <NoticeTable notices={data?.notices ?? []} emptyMessage={emptyMessage} />
      <Pagination page={filters.page} totalPages={data?.totalPages ?? 1} onChange={changePage} />
    </div>
  );
}
