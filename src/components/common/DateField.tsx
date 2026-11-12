import type { ButtonHTMLAttributes } from 'react';

import calendarIcon from '@/assets/icons/calendar.svg';
import { FIELD_BOX_CLASS_NAME } from '@/components/common/fieldBoxClassName';
import { cn } from '@/utils/cn';

// 날짜(기간) 선택 트리거입니다. 클릭 시 날짜 선택 UI 를 여는 것은 사용하는 쪽에서 처리합니다.
type DateFieldProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> & {
  value?: string;
  placeholder?: string;
};

export function DateField({
  value,
  placeholder = '날짜 선택',
  type = 'button',
  className,
  ...props
}: DateFieldProps) {
  return (
    <button
      type={type}
      className={cn(FIELD_BOX_CLASS_NAME, 'flex h-11 items-center gap-2 text-left', className)}
      {...props}
    >
      <span className={cn('flex-1 truncate', !value && 'text-motu-text-tertiary')}>
        {value || placeholder}
      </span>
      <img src={calendarIcon} alt="" width={16} height={15} />
    </button>
  );
}
