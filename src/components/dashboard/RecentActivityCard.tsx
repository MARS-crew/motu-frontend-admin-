import { Link } from 'react-router';

import { ROUTES } from '@/constants/routes';
import type { AdminActivity } from '@/types/dashboard';

type RecentActivityCardProps = {
  activities: AdminActivity[];
};

// ADM-DB-01 최근 7일 운영 작업 중 최신 4건 (시각 역순)
export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <section className="flex w-[320px] shrink-0 flex-col gap-3.5 self-stretch rounded-[14px] border border-motu-border bg-white px-6 py-5">
      <h2 className="text-title-md font-bold text-motu-text-primary">최근 운영 이력 · 7일</h2>
      <ul className="flex flex-col">
        {activities.map((activity) => (
          <li key={activity.id} className="border-b border-motu-border last:border-b-0">
            {/* TODO(MOTU-19-1): 활동 이력 ID가 내려오면 해당 기록을 선택해 엽니다. (?log=ID) */}
            <Link to={ROUTES.ACTIVITY_LOGS} className="flex flex-col gap-1 py-3.5 hover:opacity-80">
              <span className="text-body-sm font-bold text-motu-text-primary">
                {activity.time} {activity.adminName} · {activity.targetId}
              </span>
              <span className="text-label-md font-medium text-motu-text-secondary">
                {activity.action} · {activity.result}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
