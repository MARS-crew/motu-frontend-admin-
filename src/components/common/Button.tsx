import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'neutral';
type ButtonSize = 'md' | 'sm';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

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

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap font-bold transition-opacity',
        SIZE_CLASS_NAMES[size],
        disabled
          ? 'cursor-not-allowed bg-motu-border text-motu-text-tertiary'
          : cn(VARIANT_CLASS_NAMES[variant], 'hover:opacity-90'),
        className,
      )}
      {...props}
    />
  );
}
