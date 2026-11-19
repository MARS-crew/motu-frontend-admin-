import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  patchAdminStock,
  postCloseAdminStock,
  postPauseAdminStock,
  postResumeAdminStock,
} from '@/apis/adminStock';
import { ACTIVITY_LOGS_QUERY_KEY } from '@/queries/useProductHistoriesQuery';
import { PRODUCTS_QUERY_KEY } from '@/queries/useProductsQuery';
import type {
  CloseAdminStockRequest,
  PauseAdminStockRequest,
  UpdateAdminStockRequest,
} from '@/types/product';

// 상품을 바꾸면 목록·상세와 변경 이력(활동 이력)을 다시 불러옵니다.
const useInvalidateProduct = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
    ]);
};

export const useUpdateProductMutation = (stockId: number) => {
  const invalidate = useInvalidateProduct();
  return useMutation({
    mutationFn: (body: UpdateAdminStockRequest) => patchAdminStock(stockId, body),
    retry: false,
    onSuccess: invalidate,
  });
};

export const usePauseProductMutation = (stockId: number) => {
  const invalidate = useInvalidateProduct();
  return useMutation({
    mutationFn: (body: PauseAdminStockRequest) => postPauseAdminStock(stockId, body),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useResumeProductMutation = (stockId: number) => {
  const invalidate = useInvalidateProduct();
  return useMutation({
    mutationFn: (reason: string) => postResumeAdminStock(stockId, reason),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useCloseProductMutation = (stockId: number) => {
  const invalidate = useInvalidateProduct();
  return useMutation({
    mutationFn: (body: CloseAdminStockRequest) => postCloseAdminStock(stockId, body),
    retry: false,
    onSuccess: invalidate,
  });
};
