import { PageHeading } from '@/components/common/PageHeading';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';

// TODO(MOTU-28): ADM-MBR-02-01 회원 상태 변경
export default function MemberStatusPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="회원 상태 변경" />
      <PlaceholderSection />
    </div>
  );
}
