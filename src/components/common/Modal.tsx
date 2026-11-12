import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  // 하단 버튼 영역 (오른쪽 정렬)
  actions: ReactNode;
  // md: 560px(확인 모달) / lg: 640px(본문 보기 모달)
  size?: 'md' | 'lg';
  children?: ReactNode;
};

// 화면 위에 뜨는 모달입니다. Esc·배경 클릭으로 닫고, 닫히면 열기 전 포커스로 돌아갑니다.
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  actions,
  size = 'lg',
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-motu-scrim p-6">
      <div className="absolute inset-0" aria-hidden onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-full w-full flex-col gap-5 rounded-2xl bg-white p-7 shadow-modal outline-none',
          size === 'md' ? 'max-w-[560px]' : 'max-w-[640px]',
        )}
      >
        <div className="flex flex-col gap-1.5">
          <h2 id={titleId} className="text-title-lg font-bold text-motu-text-primary">
            {title}
          </h2>
          {description && (
            <div className="text-label-md font-medium text-motu-text-secondary">{description}</div>
          )}
        </div>
        {children}
        <div className="flex justify-end gap-2">{actions}</div>
      </div>
    </div>,
    document.body,
  );
}
