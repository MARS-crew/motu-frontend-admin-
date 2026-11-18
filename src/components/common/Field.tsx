import type { ReactNode } from 'react';

import { FieldMessage } from '@/components/common/FieldMessage';
import { cn } from '@/utils/cn';

// 라벨 + 입력 박스 묶음입니다. 입력 박스로 TextInput, Select, DateField, TextArea 를 넣습니다.
type FieldProps = {
  label: string;
  htmlFor?: string;
  // 이 prop 을 넘긴 칸(검증 오류가 날 수 있는 칸)은 오류가 없어도 문구 한 줄 자리를 비워 둡니다.
  errorMessage?: string;
  className?: string;
  children: ReactNode;
};

export function Field(props: FieldProps) {
  const { label, htmlFor, errorMessage, className, children } = props;
  const hasMessageSlot = 'errorMessage' in props;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="text-label-md font-medium text-motu-text-secondary">
        {label}
      </label>
      {children}
      {hasMessageSlot && <FieldMessage errorMessage={errorMessage} isReserved />}
    </div>
  );
}
