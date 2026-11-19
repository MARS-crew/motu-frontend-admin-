import type {
  AdminUserItem,
  AdminUserResponse,
  AdminUsersParams,
  MemberDetail,
  MemberFilters,
  MemberSummary,
} from '@/types/member';
import { toLocalDateTime } from '@/utils/date';

// 화면 표시용 회원 ID: 1024 → USR-1024
export const formatMemberCode = (userId: number) => `USR-${userId}`;

export const toAdminUsersParams = (filters: MemberFilters, size: number): AdminUsersParams => ({
  loginId: filters.loginId.trim() || undefined,
  nickname: filters.nickname.trim() || undefined,
  status: filters.status === 'ALL' ? undefined : filters.status,
  page: filters.page,
  size,
});

export const toMemberSummary = (item: AdminUserItem): MemberSummary => ({
  memberId: String(item.userId),
  loginId: item.loginId,
  nickname: item.nickname,
  maskedEmail: item.email,
  joinedAt: toLocalDateTime(item.createDate).slice(0, 10),
  status: item.userStatus,
  lastLoginAt: item.lastLoginDate ? toLocalDateTime(item.lastLoginDate) : null,
});

export const toMemberDetail = (response: AdminUserResponse): MemberDetail => ({
  ...toMemberSummary(response),
  isEmailVerified: response.security.emailVerified,
  isTwoFactorEnabled: response.security.twoFactorStatus === 'ENABLED',
  maskedPhone: response.security.twoFactorPhoneNumber,
  lastTwoFactorAt: response.security.twoFactorVerifiedDate
    ? toLocalDateTime(response.security.twoFactorVerifiedDate)
    : null,
  availablePoints: response.asset.availableCash,
  reservedPoints: response.asset.lockedCash,
  holdingProductCount: response.asset.holdingCount,
  openOrderCount: response.asset.openOrderCount,
  lockReason:
    response.userStatus === 'LOCKED'
      ? `로그인 ${response.security.loginFailCount}회 누적 실패`
      : null,
});
