import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { AnomaliesParams, AnomaliesResponse, AnomalyResponse } from '@/types/monitoring';

// 이상 거래 목록 (최신 발생순, 상단 건수 포함)
export const getAnomalies = async (params: AnomaliesParams) => {
  const { data } = await api.get<ApiResponse<AnomaliesResponse>>('/admin/anomalies', { params });
  return data.data;
};

export const getAnomaly = async (anomalyId: number) => {
  const { data } = await api.get<ApiResponse<AnomalyResponse>>(`/admin/anomalies/${anomalyId}`);
  return data.data;
};
