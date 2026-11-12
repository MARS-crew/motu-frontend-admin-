import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

// 라벨 + 입력 박스 묶음입니다. 입력 박스로 TextInput, Select, DateField, TextArea 를 넣습니다.
type FieldProps = {
  label: string;
  htmlFor?: string;
  errorMessage?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, errorMessage, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="text-label-md font-medium text-motu-text-secondary">
        {label}
      </label>
      {children}
      {errorMessage && (
        <p role="alert" className="text-label-md font-medium text-motu-btn-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
