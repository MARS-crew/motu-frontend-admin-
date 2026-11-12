import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

type NoticeTone = 'neutral' | 'danger' | 'success';

type NoticeProps = {
  tone?: NoticeTone;
  className?: string;
  children: ReactNode;
};

const TONE_CLASS_NAMES: Record<NoticeTone, string> = {
  neutral: 'bg-motu-bg-secondary text-motu-text-secondary',
  danger: 'bg-motu-red-light text-motu-btn-red',
  success: 'bg-motu-success-light text-motu-success',
};

export function Notice({ tone = 'neutral', className, children }: NoticeProps) {
  // 여러 줄 안내는 children 에 <p> 를 여러 개 넣습니다.
  return (
    <div
      role={tone === 'danger' ? 'alert' : undefined}
      className={cn(
        'rounded-[10px] px-3.5 py-3 text-body-sm font-medium',
        TONE_CLASS_NAMES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
