import { PageHeading } from '@/components/common/PageHeading';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';

// TODO(MOTU-28): ADM-MBR-02-02 계정 잠금 해제
export default function MemberUnlockPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="계정 잠금 해제" />
      <PlaceholderSection />
    </div>
  );
}
