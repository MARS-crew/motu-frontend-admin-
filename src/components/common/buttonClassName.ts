import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'neutral';
export type ButtonSize = 'md' | 'sm';

const VARIANT_CLASS_NAMES: Record<ButtonVariant, string> = {
  primary: 'bg-motu-black text-white',
  secondary: 'border border-motu-border bg-white text-motu-text-primary',
  danger: 'bg-motu-btn-red text-white',
  neutral: 'bg-motu-grey-chip text-motu-black',
};

const SIZE_CLASS_NAMES: Record<ButtonSize, string> = {
  md: 'h-11 rounded-xl px-5 text-title-sm',
  sm: 'h-9 rounded-[10px] px-3.5 text-body-sm',
};

type ButtonClassNameOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
};

// 버튼 스타일입니다. 링크(<Link>)를 버튼 모양으로 보여줄 때도 사용합니다.
export const buttonClassName = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
}: ButtonClassNameOptions = {}) =>
  cn(
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap font-bold transition-opacity',
    SIZE_CLASS_NAMES[size],
    disabled
      ? 'cursor-not-allowed bg-motu-border text-motu-text-tertiary'
      : cn(VARIANT_CLASS_NAMES[variant], 'hover:opacity-90'),
  );
