import { AUTH_ACCOUNT_LOCKED, AUTH_INVALID_CREDENTIALS } from '@/constants/errorCodes';
import type { LoginFailureDetails } from '@/types/auth';
import { getApiError, getApiErrorMessage } from '@/utils/apiError';

// 일반 회원 계정으로 관리자 로그인을 시도한 경우입니다.
export class NotAdminAccountError extends Error {
  constructor() {
    super('관리자 계정이 아닙니다. 관리자 아이디로 로그인해 주세요.');
    this.name = 'NotAdminAccountError';
  }
}

// 서버 잠금 안내는 사용자 앱의 '문의하기'를 가리키므로 관리자용 문구로 바꿉니다.
const ADMIN_LOCKED_MESSAGE =
  '비밀번호 입력 실패가 5회 누적되어 계정이 잠겼습니다. 다른 관리자에게 잠금 해제를 요청해 주세요.';

// 로그인 실패 안내 문구 (비밀번호 칸 아래 고정 자리에 표시합니다)
export const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof NotAdminAccountError) return error.message;

  const apiError = getApiError(error);
  if (apiError?.code === AUTH_ACCOUNT_LOCKED) return ADMIN_LOCKED_MESSAGE;
  if (apiError?.code === AUTH_INVALID_CREDENTIALS) {
    const { failCount, maxFailCount } = (apiError.details ?? {}) as LoginFailureDetails;
    return failCount && maxFailCount
      ? `${apiError.message} (실패 ${failCount}/${maxFailCount}회)`
      : apiError.message;
  }
  return getApiErrorMessage(error);
};
