import { api } from '@/apis/instance';
import type { ApiResponse, PageResponse } from '@/types/api';
import type {
  AdminStockItem,
  AdminStockResponse,
  AdminStocksParams,
  CloseAdminStockRequest,
  PauseAdminStockRequest,
  UpdateAdminStockRequest,
} from '@/types/product';

// 상장 상품 목록 (최근 등록순)
export const getAdminStocks = async (params: AdminStocksParams) => {
  const { data } = await api.get<ApiResponse<PageResponse<AdminStockItem>>>('/admin/stocks', {
    params,
  });
  return data.data;
};

export const getAdminStock = async (stockId: number) => {
  const { data } = await api.get<ApiResponse<AdminStockResponse>>(`/admin/stocks/${stockId}`);
  return data.data;
};

// 상품 정보 수정 (변경 전·후 값과 사유는 관리자 활동 이력에 저장됩니다)
export const patchAdminStock = async (stockId: number, body: UpdateAdminStockRequest) => {
  const { data } = await api.patch<ApiResponse<AdminStockResponse>>(
    `/admin/stocks/${stockId}`,
    body,
  );
  return data.data;
};

// 거래 중지: 미체결 주문 취소, 예약 포인트·수량 해제
export const postPauseAdminStock = async (stockId: number, body: PauseAdminStockRequest) => {
  await api.post(`/admin/stocks/${stockId}/pause`, body);
};

export const postResumeAdminStock = async (stockId: number, reason: string) => {
  await api.post(`/admin/stocks/${stockId}/resume`, { reason });
};

// 상품 종료 (다시 거래 가능으로 되돌릴 수 없습니다)
export const postCloseAdminStock = async (stockId: number, body: CloseAdminStockRequest) => {
  await api.post(`/admin/stocks/${stockId}/close`, body);
};
