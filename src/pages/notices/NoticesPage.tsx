import { NoticeFilterCard } from '@/components/notice/NoticeFilterCard';
import { NoticeTable } from '@/components/notice/NoticeTable';
import { NOTICES_PREVIEW } from '@/constants/noticePreview';
import { useNoticeFilters } from '@/hooks/useNoticeFilters';
import type { NoticeFilters, NoticeSummary } from '@/types/notice';

// TODO(MOTU-26-1): 서버 검색으로 교체합니다. 퍼블리싱 확인용으로 예시 데이터를 거릅니다.
// 게시 기간은 선택한 기간과 하루라도 겹치는 공지를 보여줍니다.
const filterPreview = (notices: NoticeSummary[], filters: NoticeFilters) => {
  const keyword = filters.keyword.trim().toLowerCase();
  return notices.filter(
    (notice) =>
      (!keyword ||
        notice.title.toLowerCase().includes(keyword) ||
        notice.noticeId.toLowerCase().includes(keyword)) &&
      (filters.type === 'ALL' || notice.type === filters.type) &&
      (filters.status === 'ALL' || notice.status === filters.status) &&
      (!filters.from ||
        !filters.to ||
        (notice.startAt !== null &&
          notice.endAt !== null &&
          notice.startAt.slice(0, 10) <= filters.to &&
          notice.endAt.slice(0, 10) >= filters.from)),
  );
};

// ADM-NTC-01 공지 목록
export default function NoticesPage() {
  const { filters, updateFilters } = useNoticeFilters();
  const notices = filterPreview(NOTICES_PREVIEW, filters);

  return (
    <div className="flex flex-col gap-5">
      <NoticeFilterCard filters={filters} onChange={updateFilters} />
      <NoticeTable notices={notices} />
    </div>
  );
}
