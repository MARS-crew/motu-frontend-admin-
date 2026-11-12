import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

// neutral: 접수·검토중 / success: 승인·정상·게시 중 / danger: 보완 요청·반려·정지 / muted: 임시 저장·비공개·종료
export type BadgeTone = 'neutral' | 'success' | 'danger' | 'muted';

type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
};

const TONE_CLASS_NAMES: Record<BadgeTone, string> = {
  neutral: 'bg-motu-bg-secondary text-motu-text-secondary',
  success: 'bg-motu-success-light text-motu-success',
  danger: 'bg-motu-red-light text-motu-btn-red',
  muted: 'bg-motu-tonal text-motu-black',
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-label-md font-medium',
        TONE_CLASS_NAMES[tone],
      )}
    >
      {children}
    </span>
  );
}
