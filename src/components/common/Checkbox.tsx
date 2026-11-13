import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode;
};

// 라벨이 붙은 체크박스입니다. (최종 확인 항목 등)
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2', className)}>
      <input
        type="checkbox"
        className="size-[18px] cursor-pointer rounded-[5px] accent-motu-black"
        {...props}
      />
      <span className="text-body-sm font-medium text-motu-text-primary">{label}</span>
    </label>
  );
}
