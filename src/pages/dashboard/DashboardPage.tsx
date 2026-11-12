import { DashboardStatCards } from '@/components/dashboard/DashboardStatCards';
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard';
import { TradeTrendCard } from '@/components/dashboard/TradeTrendCard';
import { DASHBOARD_STATS_PREVIEW, RECENT_ACTIVITIES_PREVIEW } from '@/constants/dashboardPreview';

// ADM-DB-01 운영 현황
export default function DashboardPage() {
  // TODO(MOTU-19-1): 운영 지표·최근 운영 이력 API 연동 (진입·새로고침 시 갱신)
  const stats = DASHBOARD_STATS_PREVIEW;
  const activities = RECENT_ACTIVITIES_PREVIEW;

  return (
    <div className="flex flex-col gap-5">
      <DashboardStatCards stats={stats} />
      <div className="flex items-start gap-5">
        <TradeTrendCard />
        <RecentActivityCard activities={activities} />
      </div>
    </div>
  );
}
