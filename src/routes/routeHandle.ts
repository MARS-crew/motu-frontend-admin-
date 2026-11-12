import { useEffect } from 'react';
import { useMatches } from 'react-router';

// 라우트 handle 에 페이지 제목을 지정합니다. → { path: 'listings', handle: { title: '상장 신청 목록' } }
export type RouteHandle = {
  title?: string;
};

const APP_NAME = '모투 관리자';

const hasTitle = (handle: unknown): handle is Required<RouteHandle> =>
  typeof handle === 'object' &&
  handle !== null &&
  'title' in handle &&
  typeof handle.title === 'string';

// 가장 안쪽 라우트의 제목을 반환하고, 브라우저 탭 제목에도 반영합니다.
export const usePageTitle = () => {
  const matches = useMatches();
  const match = [...matches].reverse().find((routeMatch) => hasTitle(routeMatch.handle));
  const title = match && hasTitle(match.handle) ? match.handle.title : '';

  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [title]);

  return title;
};
