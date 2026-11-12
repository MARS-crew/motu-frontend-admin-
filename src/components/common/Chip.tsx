import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

// 탭·기간 선택·단일 선택용 칩입니다.
type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected?: boolean;
};

export function Chip({ isSelected = false, type = 'button', className, ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={isSelected}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-2 text-label-md font-medium',
        isSelected
          ? 'bg-motu-black text-white'
          : 'border border-motu-border bg-white text-motu-text-secondary',
        className,
      )}
      {...props}
    />
  );
}
