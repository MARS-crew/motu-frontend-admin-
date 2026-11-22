import { DashboardStatCards } from '@/components/dashboard/DashboardStatCards';
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard';
import { TradeTrendCard } from '@/components/dashboard/TradeTrendCard';
import { useDashboardKpisQuery, useRecentActivitiesQuery } from '@/queries/useDashboardQuery';
import { getApiErrorMessage } from '@/utils/apiError';

// ADM-DB-01 운영 현황 (진입·새로고침 시 최신 값으로 갱신)
export default function DashboardPage() {
  const { data: stats } = useDashboardKpisQuery();
  const activities = useRecentActivitiesQuery();

  const activityEmptyMessage = activities.isPending
    ? '운영 이력을 불러오는 중입니다.'
    : activities.isError
      ? getApiErrorMessage(activities.error)
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      <DashboardStatCards stats={stats} />
      <div className="flex items-start gap-5">
        <TradeTrendCard />
        <RecentActivityCard
          activities={activities.data ?? []}
          emptyMessage={activityEmptyMessage}
        />
      </div>
    </div>
  );
}
