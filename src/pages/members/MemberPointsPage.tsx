import { PageHeading } from '@/components/common/PageHeading';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';

// TODO(MOTU-28): ADM-MBR-02-03 회원 포인트 지급 / 회수
export default function MemberPointsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="회원 포인트 지급 / 회수" />
      <PlaceholderSection />
    </div>
  );
}
