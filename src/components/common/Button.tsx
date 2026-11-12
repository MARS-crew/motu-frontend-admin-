import type { ButtonHTMLAttributes } from 'react';

import type { ButtonSize, ButtonVariant } from '@/components/common/buttonClassName';
import { buttonClassName } from '@/components/common/buttonClassName';
import { cn } from '@/utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
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
      className={cn(buttonClassName({ variant, size, disabled }), className)}
      {...props}
    />
  );
}
