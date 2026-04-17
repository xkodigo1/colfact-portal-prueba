import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

const toneClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-surface-100 text-surface-700',
};

export const Badge = ({ children, className, tone = 'neutral', ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
