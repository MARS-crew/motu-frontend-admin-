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

// 거래 중지·회원 정지 화면으로 넘어가기 전에 '확인중'으로 바꿉니다. (확정은 넘어간 화면에서 처리)
export const postReviewAnomaly = async (
  anomalyId: number,
  action: 'STOCK_PAUSE' | 'USER_BLOCK',
) => {
  await api.post(`/admin/anomalies/${anomalyId}/review`, { action });
};

// 이상 없음 처리 (처리완료로 바꾸고 관리자 활동 이력에 기록)
export const postDismissAnomaly = async (anomalyId: number, reason: string) => {
  await api.post(`/admin/anomalies/${anomalyId}/dismiss`, { reason });
};
