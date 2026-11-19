// 서버는 모든 응답을 { success, data } 형태로 감싸서 내려줍니다.
export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

// 관리자 목록 API 의 페이지 응답입니다. (page 는 1부터)
export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalCount: number;
};
