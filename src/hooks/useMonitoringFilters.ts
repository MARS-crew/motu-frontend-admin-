import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { MonitoringFilters } from '@/types/monitoring';

// 거래 모니터링 조회 조건을 URL 쿼리로 관리합니다. 조건을 바꾸면 바로 목록에 반영합니다.
// 발생 기간 기본값은 최근 24시간입니다.
export const useMonitoringFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<MonitoringFilters>(
    () => ({
      type: (searchParams.get('type') as MonitoringFilters['type']) ?? 'ALL',
      status: (searchParams.get('status') as MonitoringFilters['status']) ?? 'ALL',
      period: (searchParams.get('period') as MonitoringFilters['period']) ?? '24h',
      from: searchParams.get('from'),
      to: searchParams.get('to'),
      targetId: searchParams.get('target') ?? '',
    }),
    [searchParams],
  );

  const updateFilters = (next: Partial<MonitoringFilters>) => {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();
    if (merged.type !== 'ALL') params.set('type', merged.type);
    if (merged.status !== 'ALL') params.set('status', merged.status);
    if (merged.period !== '24h') params.set('period', merged.period);
    if (merged.period === 'custom' && merged.from && merged.to) {
      params.set('from', merged.from);
      params.set('to', merged.to);
    }
    if (merged.targetId.trim()) params.set('target', merged.targetId.trim());
    setSearchParams(params, { replace: true });
  };

  return { filters, updateFilters };
};
