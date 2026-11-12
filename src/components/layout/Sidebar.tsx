import { NavLink } from 'react-router';

import { SIDEBAR_MENUS } from '@/constants/menus';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

export function Sidebar() {
  return (
    <nav
      aria-label="관리자 메뉴"
      className="flex w-sidebar shrink-0 flex-col gap-1 border-r border-motu-border bg-white px-4 py-5"
    >
      {SIDEBAR_MENUS.map((menu) => (
        <NavLink
          key={menu.path}
          to={menu.path}
          // 대시보드('/')는 하위 경로에서 강조되지 않도록 정확히 일치할 때만 활성화합니다.
          end={menu.path === ROUTES.DASHBOARD}
          className={({ isActive }) =>
            cn(
              'flex h-11 items-center gap-3 rounded-xl px-3',
              isActive
                ? 'bg-motu-bg-secondary text-title-sm font-bold text-motu-text-primary'
                : 'text-body-md font-medium text-motu-text-secondary hover:bg-motu-bg',
            )
          }
        >
          {({ isActive }) => (
            <>
              <img src={isActive ? menu.activeIcon : menu.icon} alt="" width={20} height={20} />
              {menu.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
