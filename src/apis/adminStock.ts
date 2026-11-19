import { api } from '@/apis/instance';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { AdminStockItem, AdminStockResponse, AdminStocksParams } from '@/types/product';

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
