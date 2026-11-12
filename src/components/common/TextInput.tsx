import type { InputHTMLAttributes } from 'react';

import {
  FIELD_BOX_CLASS_NAME,
  FIELD_BOX_ERROR_CLASS_NAME,
  FIELD_BOX_READ_ONLY_CLASS_NAME,
} from '@/components/common/fieldBoxClassName';
import { cn } from '@/utils/cn';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

// readOnly 를 주면 읽기 전용(회색 배경) 스타일이 됩니다.
export function TextInput({ hasError = false, className, ...props }: TextInputProps) {
  return (
    <input
      className={cn(
        FIELD_BOX_CLASS_NAME,
        FIELD_BOX_READ_ONLY_CLASS_NAME,
        'h-11',
        hasError && FIELD_BOX_ERROR_CLASS_NAME,
        className,
      )}
      {...props}
    />
  );
}
