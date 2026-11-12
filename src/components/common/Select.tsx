import { useCallback, useId, useRef, useState } from 'react';

import checkIcon from '@/assets/icons/check.svg';
import chevronDownIcon from '@/assets/icons/field-chevron-down.svg';
import {
  FIELD_BOX_CLASS_NAME,
  FIELD_BOX_ERROR_CLASS_NAME,
} from '@/components/common/fieldBoxClassName';
import { useDismiss } from '@/hooks/useDismiss';
import { cn } from '@/utils/cn';

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

type SelectProps<T extends string> = {
  options: SelectOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
  id?: string;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
};

// 드롭다운 선택 박스입니다. 펼치면 옵션 목록을 띄우고 선택된 항목에 체크를 표시합니다.
// React Hook Form 에서는 Controller 로 연결합니다.
export function Select<T extends string>({
  options,
  value,
  onChange,
  id,
  placeholder = '선택',
  hasError = false,
  disabled = false,
  className,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value);

  const handleClose = useCallback(() => setIsOpen(false), []);
  useDismiss(containerRef, isOpen, handleClose);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={handleToggle}
        className={cn(
          FIELD_BOX_CLASS_NAME,
          'flex h-11 items-center gap-2 text-left',
          isOpen && 'border-motu-black',
          hasError && FIELD_BOX_ERROR_CLASS_NAME,
        )}
      >
        <span className={cn('flex-1 truncate', !selectedOption && 'text-motu-text-tertiary')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <img src={chevronDownIcon} alt="" width={16} height={16} />
      </button>
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1.5 rounded-xl border border-motu-border bg-white py-1.5 shadow-popover"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex h-[38px] cursor-pointer items-center gap-2 px-3.5 text-body-sm font-bold text-motu-text-primary',
                  isSelected ? 'bg-motu-bg-secondary' : 'hover:bg-motu-bg',
                )}
              >
                <span className="flex-1 truncate">{option.label}</span>
                {isSelected && <img src={checkIcon} alt="" width={16} height={16} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
