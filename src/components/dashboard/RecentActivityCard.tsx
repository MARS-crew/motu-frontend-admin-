import { Link } from 'react-router';

import { ROUTES } from '@/constants/routes';
import type { AdminActivity } from '@/types/dashboard';

type RecentActivityCardProps = {
  activities: AdminActivity[];
  // 불러오는 중·실패·이력 없음 안내
  emptyMessage?: string;
};

// ADM-DB-01 최근 7일 운영 작업 중 최신 4건 (시각 역순)
// 이력을 누르면 관리자 활동 이력(ADM-MON-04)에서 해당 기록을 선택해 엽니다.
export function RecentActivityCard({
  activities,
  emptyMessage = '최근 7일 운영 이력이 없습니다.',
}: RecentActivityCardProps) {
  return (
    <section className="flex w-[320px] shrink-0 flex-col gap-3.5 self-stretch rounded-[14px] border border-motu-border bg-white px-6 py-5">
      <h2 className="text-title-md font-bold text-motu-text-primary">최근 운영 이력 · 7일</h2>
      {activities.length === 0 ? (
        <p className="py-3.5 text-body-sm font-medium text-motu-text-tertiary">{emptyMessage}</p>
      ) : (
        <ul className="flex flex-col">
          {activities.map((activity) => (
            <li key={activity.id} className="border-b border-motu-border last:border-b-0">
              <Link
                to={`${ROUTES.ACTIVITY_LOGS}?log=${encodeURIComponent(activity.id)}`}
                className="flex flex-col gap-1 py-3.5 hover:opacity-80"
              >
                <span className="truncate text-body-sm font-bold text-motu-text-primary">
                  {activity.time} {activity.adminName} · {activity.targetId}
                </span>
                <span className="text-label-md font-medium text-motu-text-secondary">
                  {activity.action} · {activity.result}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
