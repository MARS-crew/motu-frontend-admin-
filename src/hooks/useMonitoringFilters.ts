import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { MonitoringFilters } from '@/types/monitoring';

// 거래 모니터링 조회 조건과 페이지를 URL 쿼리로 관리합니다. 조건을 바꾸면 바로 목록에 반영합니다.
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
      page: Math.max(Number(searchParams.get('page')) || 1, 1),
    }),
    [searchParams],
  );

  const applyParams = (next: MonitoringFilters) => {
    const params = new URLSearchParams();
    if (next.type !== 'ALL') params.set('type', next.type);
    if (next.status !== 'ALL') params.set('status', next.status);
    if (next.period !== '24h') params.set('period', next.period);
    if (next.period === 'custom' && next.from && next.to) {
      params.set('from', next.from);
      params.set('to', next.to);
    }
    if (next.targetId.trim()) params.set('target', next.targetId.trim());
    if (next.page > 1) params.set('page', String(next.page));
    setSearchParams(params, { replace: true });
  };

  // 조회 조건을 바꾸면 첫 페이지부터 봅니다.
  const updateFilters = (next: Partial<Omit<MonitoringFilters, 'page'>>) =>
    applyParams({ ...filters, ...next, page: 1 });

  const changePage = (page: number) => applyParams({ ...filters, page });

  return { filters, updateFilters, changePage };
};
