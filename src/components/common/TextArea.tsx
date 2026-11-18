import type { TextareaHTMLAttributes } from 'react';

import {
  FIELD_BOX_CLASS_NAME,
  FIELD_BOX_ERROR_CLASS_NAME,
  FIELD_BOX_READ_ONLY_CLASS_NAME,
} from '@/components/common/fieldBoxClassName';
import { cn } from '@/utils/cn';

// fill: 부모(flex-col) 높이를 채웁니다. 옆 칸 높이에 맞출 때 사용합니다. (상품 소개)
type TextAreaSize = 'md' | 'lg' | 'fill';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: TextAreaSize;
  hasError?: boolean;
};

const SIZE_CLASS_NAMES: Record<TextAreaSize, string> = {
  md: 'h-[88px]',
  lg: 'h-[168px]',
  fill: 'min-h-[88px] flex-1',
};

export function TextArea({ size = 'md', hasError = false, className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        FIELD_BOX_CLASS_NAME,
        FIELD_BOX_READ_ONLY_CLASS_NAME,
        'resize-none py-3',
        SIZE_CLASS_NAMES[size],
        hasError && FIELD_BOX_ERROR_CLASS_NAME,
        className,
      )}
      {...props}
    />
  );
}
