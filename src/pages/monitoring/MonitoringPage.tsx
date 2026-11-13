import { StatCard } from '@/components/common/StatCard';
import { AbnormalTradeTable } from '@/components/monitoring/AbnormalTradeTable';
import { MonitoringFilterCard } from '@/components/monitoring/MonitoringFilterCard';
import { ABNORMAL_TRADES_PREVIEW } from '@/constants/monitoringPreview';
import { useMonitoringFilters } from '@/hooks/useMonitoringFilters';
import type { AbnormalTradeSummary, MonitoringFilters } from '@/types/monitoring';
import { formatNumber } from '@/utils/format';

// TODO(MOTU-24-1): 서버 조회(기간 포함)로 교체합니다.
// 퍼블리싱 확인용으로 예시 데이터를 탐지 유형·처리 상태·ID 로만 거릅니다.
const filterPreview = (trades: AbnormalTradeSummary[], filters: MonitoringFilters) => {
  const targetId = filters.targetId.trim().toUpperCase();
  return trades.filter(
    (trade) =>
      (filters.type === 'ALL' || trade.type === filters.type) &&
      (filters.status === 'ALL' || trade.status === filters.status) &&
      (!targetId || trade.productId.includes(targetId) || trade.memberId.includes(targetId)),
  );
};

// ADM-MON-01 거래 및 주문 모니터링
// 모니터링 결과는 조치 전 확인 자료이며, 자동으로 상품·회원 상태를 바꾸지 않습니다.
export default function MonitoringPage() {
  const { filters, updateFilters } = useMonitoringFilters();
  const trades = filterPreview(ABNORMAL_TRADES_PREVIEW, filters);

  // 상단 건수는 현재 조회 조건의 결과입니다.
  const countBy = (predicate: (trade: AbnormalTradeSummary) => boolean) =>
    formatNumber(trades.filter(predicate).length);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="이상 거래" value={formatNumber(trades.length)} />
        <StatCard label="미처리" value={countBy((trade) => trade.status === 'UNPROCESSED')} />
        <StatCard
          label="주문 처리 실패"
          value={countBy((trade) => trade.type === 'ORDER_FAILURE')}
        />
        <StatCard
          label="잔액 불일치"
          value={countBy((trade) => trade.type === 'BALANCE_MISMATCH')}
        />
      </div>
      <MonitoringFilterCard key={filters.targetId} filters={filters} onChange={updateFilters} />
      <AbnormalTradeTable trades={trades} />
    </div>
  );
}
