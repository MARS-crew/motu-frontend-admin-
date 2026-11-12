import { Link } from 'react-router';

import { StatCard } from '@/components/common/StatCard';
import { ROUTES } from '@/constants/routes';
import type { DashboardStats } from '@/types/dashboard';
import { formatNumber, formatSignedNumber, getDeltaTone } from '@/utils/format';

type DashboardStatCardsProps = {
  stats: DashboardStats;
};

// ADM-DB-01 운영 지표 카드 (KST 전일 마감 대비: 회원은 증감률, 나머지는 건수 차이)
export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="전체 회원"
        value={formatNumber(stats.memberCount)}
        delta={formatSignedNumber(stats.memberChangeRate, '%')}
        deltaTone={getDeltaTone(stats.memberChangeRate)}
      />
      <StatCard
        label="상장 상품"
        value={formatNumber(stats.listedProductCount)}
        delta={formatSignedNumber(stats.listedProductChange)}
        deltaTone={getDeltaTone(stats.listedProductChange)}
      />
      <StatCard
        label="처리 대기"
        value={formatNumber(stats.pendingCount)}
        delta={
          <Link to={ROUTES.INQUIRIES} className="hover:underline">
            {formatSignedNumber(stats.pendingChange)} · 상장 {stats.pendingListingCount} · 계정 문의{' '}
            {stats.pendingInquiryCount} ›
          </Link>
        }
        deltaTone="down"
      />
      <StatCard
        label="이상 거래"
        value={formatNumber(stats.abnormalTradeCount)}
        delta={formatSignedNumber(stats.abnormalTradeChange)}
        deltaTone={getDeltaTone(stats.abnormalTradeChange)}
      />
    </div>
  );
}
