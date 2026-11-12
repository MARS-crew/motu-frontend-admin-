import { isAxiosError } from 'axios';

import type { ApiErrorResponse } from '@/types/api';

const DEFAULT_ERROR_MESSAGE = '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse =>
  typeof value === 'object' &&
  value !== null &&
  'success' in value &&
  value.success === false &&
  'error' in value;

export const getApiError = (error: unknown) => {
  if (isAxiosError(error) && isApiErrorResponse(error.response?.data)) {
    return error.response.data.error;
  }
  return null;
};

export const getApiErrorMessage = (error: unknown, fallback = DEFAULT_ERROR_MESSAGE) =>
  getApiError(error)?.message ?? fallback;
