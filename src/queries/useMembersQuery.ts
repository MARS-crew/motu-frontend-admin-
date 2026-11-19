import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getAdminUser, getAdminUsers } from '@/apis/adminUser';
import { MEMBER_PAGE_SIZE } from '@/constants/member';
import type { MemberFilters } from '@/types/member';
import { toAdminUsersParams, toMemberDetail, toMemberSummary } from '@/utils/member';

export const MEMBERS_QUERY_KEY = ['admin', 'users'];

export const useMembersQuery = (filters: MemberFilters) =>
  useQuery({
    queryKey: [...MEMBERS_QUERY_KEY, 'list', filters],
    queryFn: () => getAdminUsers(toAdminUsersParams(filters, MEMBER_PAGE_SIZE)),
    select: (data) => ({
      members: data.items.map(toMemberSummary),
      totalPages: Math.max(Math.ceil(data.totalCount / MEMBER_PAGE_SIZE), 1),
    }),
    // 페이지·검색 조건을 바꾸는 동안 이전 목록을 유지해 깜빡이지 않게 합니다.
    placeholderData: keepPreviousData,
  });

// 회원 상세 (주소의 회원 ID 가 숫자가 아니면 조회하지 않습니다)
export const useMemberDetailQuery = (userId: number) =>
  useQuery({
    queryKey: [...MEMBERS_QUERY_KEY, 'detail', userId],
    queryFn: () => getAdminUser(userId),
    select: toMemberDetail,
    enabled: Number.isInteger(userId) && userId > 0,
  });
