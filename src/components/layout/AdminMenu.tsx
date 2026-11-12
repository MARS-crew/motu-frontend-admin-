import { useEffect, useRef, useState } from 'react';

import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import { useLogoutMutation } from '@/queries/useLogoutMutation';

// 헤더 오른쪽 "관리자 ▾" 드롭다운입니다.
export function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mutate: logout, isPending } = useLogoutMutation();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleLogout = () => logout();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className="flex items-center gap-1 text-body-md font-medium text-motu-text-primary"
      >
        관리자
        <img src={chevronDownIcon} alt="" width={16} height={16} />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-2 w-32 rounded-xl border border-motu-border bg-white py-1 shadow-sm"
        >
          <button
            type="button"
            role="menuitem"
            disabled={isPending}
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-body-sm font-medium text-motu-text-primary hover:bg-motu-bg disabled:text-motu-text-tertiary"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
