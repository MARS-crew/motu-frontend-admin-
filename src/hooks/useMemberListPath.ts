import { useLocation } from 'react-router';

import { ROUTES } from '@/constants/routes';

export type MemberLocationState = {
  // 목록에서 넘겨준 검색 쿼리 (?status=...&page=2)
  listSearch?: string;
} | null;

// 회원 목록으로 돌아갈 경로입니다. 목록에서 넘겨준 검색 조건을 유지합니다.
export const useMemberListPath = () => {
  const location = useLocation();
  const listSearch = (location.state as MemberLocationState)?.listSearch ?? '';
  return `${ROUTES.MEMBERS}${listSearch}`;
};
