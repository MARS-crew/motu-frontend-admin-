import { useEffect } from 'react';
import { useMatches } from 'react-router';

export type HeaderAction = {
  label: string;
  to: string;
};

// 라우트 handle 에 페이지 제목과 헤더 오른쪽 버튼을 지정합니다.
// → { path: 'monitoring', handle: { title: '거래 및 주문 모니터링', action: { label, to } } }
export type RouteHandle = {
  title?: string;
  action?: HeaderAction;
};

const APP_NAME = '모투 관리자';

const isRouteHandle = (handle: unknown): handle is RouteHandle =>
  typeof handle === 'object' && handle !== null;

// 가장 안쪽 라우트의 제목·헤더 버튼을 반환하고, 브라우저 탭 제목에도 반영합니다.
export const usePageHandle = () => {
  const matches = useMatches();
  const handle = [...matches]
    .reverse()
    .map((routeMatch) => routeMatch.handle)
    .find((value): value is RouteHandle => isRouteHandle(value) && typeof value.title === 'string');
  const title = handle?.title ?? '';

  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [title]);

  return { title, action: handle?.action };
};
