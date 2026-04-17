import type { ButtonHTMLAttributes } from 'react';

import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary-600 text-white shadow-panel transition hover:bg-primary-700 focus-visible:outline-primary-500',
  secondary:
    'bg-white text-surface-900 ring-1 ring-inset ring-surface-200 transition hover:bg-surface-100 focus-visible:outline-primary-500',
  ghost:
    'bg-transparent text-surface-700 transition hover:bg-surface-100 focus-visible:outline-primary-500',
  danger: 'bg-danger text-white transition hover:opacity-90 focus-visible:outline-danger',
};

export const Button = ({
  children,
  className,
  disabled,
  isLoading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <Spinner className="h-4 w-4 border-2 border-white/30 border-t-white" /> : null}
      {children}
    </button>
  );
};
