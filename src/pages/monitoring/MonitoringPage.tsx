import { Pagination } from '@/components/common/Pagination';
import { StatCard } from '@/components/common/StatCard';
import { AbnormalTradeTable } from '@/components/monitoring/AbnormalTradeTable';
import { MonitoringFilterCard } from '@/components/monitoring/MonitoringFilterCard';
import { useMonitoringFilters } from '@/hooks/useMonitoringFilters';
import { useAnomaliesQuery } from '@/queries/useAnomaliesQuery';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatNumber } from '@/utils/format';

// ADM-MON-01 거래 및 주문 모니터링 (최신 발생순, 한 페이지 20건)
// 모니터링 결과는 조치 전 확인 자료이며, 자동으로 상품·회원 상태를 바꾸지 않습니다.
export default function MonitoringPage() {
  const { filters, updateFilters, changePage } = useMonitoringFilters();
  const { data, isPending, isError, error } = useAnomaliesQuery(filters);

  // 상단 건수는 현재 조회 조건의 결과입니다. (불러오기 전에는 -)
  const summary = data?.summary;
  const formatCount = (value: number | undefined) =>
    value === undefined ? '-' : formatNumber(value);

  const emptyMessage = isPending
    ? '이상 거래를 불러오는 중입니다.'
    : isError
      ? getApiErrorMessage(error)
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="이상 거래" value={formatCount(summary?.totalCount)} />
        <StatCard label="미처리" value={formatCount(summary?.pendingCount)} />
        <StatCard
          label="주문 처리 실패"
          value={formatCount(summary && (summary.typeCounts.ORDER_FAILURE ?? 0))}
        />
        <StatCard
          label="잔액 불일치"
          value={formatCount(summary && (summary.typeCounts.BALANCE_MISMATCH ?? 0))}
        />
      </div>
      <MonitoringFilterCard key={filters.targetId} filters={filters} onChange={updateFilters} />
      <AbnormalTradeTable trades={data?.trades ?? []} emptyMessage={emptyMessage} />
      <Pagination page={filters.page} totalPages={data?.totalPages ?? 1} onChange={changePage} />
    </div>
  );
}
