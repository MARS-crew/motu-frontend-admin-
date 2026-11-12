import type { TextareaHTMLAttributes } from 'react';

import {
  FIELD_BOX_CLASS_NAME,
  FIELD_BOX_ERROR_CLASS_NAME,
} from '@/components/common/fieldBoxClassName';
import { cn } from '@/utils/cn';

type TextAreaSize = 'md' | 'lg';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: TextAreaSize;
  hasError?: boolean;
};

const SIZE_CLASS_NAMES: Record<TextAreaSize, string> = {
  md: 'h-[88px]',
  lg: 'h-[168px]',
};

export function TextArea({ size = 'md', hasError = false, className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        FIELD_BOX_CLASS_NAME,
        'resize-none py-3',
        SIZE_CLASS_NAMES[size],
        hasError && FIELD_BOX_ERROR_CLASS_NAME,
        className,
      )}
      {...props}
    />
  );
}
