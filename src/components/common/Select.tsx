import type { SelectHTMLAttributes } from 'react';

import chevronDownIcon from '@/assets/icons/field-chevron-down.svg';
import {
  FIELD_BOX_CLASS_NAME,
  FIELD_BOX_ERROR_CLASS_NAME,
} from '@/components/common/fieldBoxClassName';
import { cn } from '@/utils/cn';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
};

export function Select({
  options,
  placeholder,
  hasError = false,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        className={cn(
          FIELD_BOX_CLASS_NAME,
          'h-11 cursor-pointer appearance-none pr-10',
          hasError && FIELD_BOX_ERROR_CLASS_NAME,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <img
        src={chevronDownIcon}
        alt=""
        width={16}
        height={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
      />
    </div>
  );
}
