import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type {
  DashboardKpisResponse,
  TradeTrendApiRange,
  TradeTrendResponse,
} from '@/types/dashboard';

// 운영 지표 카드 (전일 마감 대비 증감 포함)
export const getDashboardKpis = async () => {
  const { data } = await api.get<ApiResponse<DashboardKpisResponse>>('/admin/dashboard/kpis');
  return data.data;
};

type TradeTrendParams = {
  range: TradeTrendApiRange;
  // 직접 설정(CUSTOM)일 때 KST 날짜 YYYY-MM-DD (종료일 포함)
  from?: string;
  to?: string;
};

// 거래량·거래대금 추이 (조회 구간별 집계 단위는 서버가 정합니다)
export const getTradeTrend = async (params: TradeTrendParams) => {
  const { data } = await api.get<ApiResponse<TradeTrendResponse>>('/admin/dashboard/trade-trend', {
    params,
  });
  return data.data;
};
