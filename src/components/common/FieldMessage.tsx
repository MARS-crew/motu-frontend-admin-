import { cn } from '@/utils/cn';

// 입력 박스 아래 안내 문구입니다. 에러가 있으면 에러 문구(빨강), 없으면 안내 문구(회색)를 표시합니다.
// 여러 입력 박스를 한 줄에 놓고 문구를 하나만 보여줄 때 사용합니다.
type FieldMessageProps = {
  errorMessage?: string;
  helperText?: string;
  // 문구가 없어도 한 줄 높이를 비워 둡니다. 문구가 나타날 때 아래 버튼·입력칸이 밀리지 않습니다.
  isReserved?: boolean;
};

export function FieldMessage({ errorMessage, helperText, isReserved = false }: FieldMessageProps) {
  const message = errorMessage ?? helperText;
  if (!message && !isReserved) return null;

  return (
    <p
      role={errorMessage ? 'alert' : undefined}
      aria-hidden={message ? undefined : true}
      className={cn(
        'min-h-4 w-full text-label-md font-medium',
        errorMessage ? 'text-motu-btn-red' : 'text-motu-text-tertiary',
      )}
    >
      {message}
    </p>
  );
}
