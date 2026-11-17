import type { ChangeEvent, InputHTMLAttributes } from 'react';

import { TextInput } from '@/components/common/TextInput';
import { formatNumber } from '@/utils/format';

type PointInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  // 쉼표가 들어간 숫자 문자열 (1,000)
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
};

// 숫자만 남기고 천 단위 쉼표를 붙입니다. 오른쪽에 단위 P를 표시합니다.
const toPointText = (value: string) => {
  const digits = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits ? formatNumber(Number(digits)) : '';
};

// 포인트 금액 입력 (React Hook Form 에서는 Controller 로 연결합니다)
export function PointInput({ value, onChange, hasError, ...props }: PointInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(toPointText(event.target.value));

  return (
    <div className="relative">
      <TextInput
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={handleChange}
        hasError={hasError}
        className="pr-9"
        {...props}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-body-md font-medium text-motu-text-primary"
      >
        P
      </span>
    </div>
  );
}
