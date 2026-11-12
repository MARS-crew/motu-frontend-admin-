import { Link } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import { ListingStatusBadge } from '@/components/listing/ListingStatusBadge';
import type { ListingApplicationStatus } from '@/types/listing';

type ListingDetailHeaderProps = {
  applicationId: string;
  applicantName: string;
  status: ListingApplicationStatus;
  // [목록으로] 이동 경로 (검색 조건 유지)
  listPath: string;
};

// 신청번호·신청자·상태 (탭을 바꿔도 유지합니다)
export function ListingDetailHeader({
  applicationId,
  applicantName,
  status,
  listPath,
}: ListingDetailHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Link to={listPath} className={buttonClassName({ variant: 'neutral', size: 'sm' })}>
        ‹ 목록으로
      </Link>
      <h2 className="text-title-lg font-bold text-motu-text-primary">
        {applicationId} · {applicantName}
      </h2>
      <ListingStatusBadge status={status} />
    </div>
  );
}
