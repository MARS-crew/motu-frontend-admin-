import { Link } from 'react-router';

import { StatCard } from '@/components/common/StatCard';
import { ROUTES } from '@/constants/routes';
import type { DashboardStats } from '@/types/dashboard';
import { formatNumber, formatSignedNumber, getDeltaTone } from '@/utils/format';

type DashboardStatCardsProps = {
  // 불러오는 중이면 undefined (값 자리에 - 표시)
  stats: DashboardStats | undefined;
};

// 전일 통계가 없어 비교할 수 없으면 증감을 표시하지 않습니다.
const toDelta = (value: number | null | undefined, suffix = '') =>
  value === null || value === undefined
    ? {}
    : { delta: formatSignedNumber(value, suffix), deltaTone: getDeltaTone(value) };

const formatCount = (value: number | undefined) =>
  value === undefined ? '-' : formatNumber(value);

// ADM-DB-01 운영 지표 카드 (KST 전일 마감 대비: 회원은 증감률, 나머지는 건수 차이)
export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  const pendingChange =
    stats?.pendingChange === null || stats?.pendingChange === undefined
      ? ''
      : `${formatSignedNumber(stats.pendingChange)} · `;

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="전체 회원"
        value={formatCount(stats?.memberCount)}
        {...toDelta(stats?.memberChangeRate, '%')}
      />
      <StatCard
        label="상장 상품"
        value={formatCount(stats?.listedProductCount)}
        {...toDelta(stats?.listedProductChange)}
      />
      <StatCard
        label="처리 대기"
        value={formatCount(stats?.pendingCount)}
        delta={
          stats && (
            <Link to={ROUTES.INQUIRIES} className="hover:underline">
              {pendingChange}상장 {stats.pendingListingCount} · 계정 문의{' '}
              {stats.pendingInquiryCount} ›
            </Link>
          )
        }
        deltaTone="down"
      />
      <StatCard
        label="이상 거래"
        value={formatCount(stats?.abnormalTradeCount)}
        {...toDelta(stats?.abnormalTradeChange)}
      />
    </div>
  );
}
