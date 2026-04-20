import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id, label, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-2 text-sm font-medium text-surface-700 dark:text-surface-100/80" htmlFor={id}>
        <span>{label}</span>
        <input
          className={cn(
            'rounded-2xl border bg-white px-4 py-2.5 text-sm text-surface-900 shadow-sm outline-none transition placeholder:text-surface-700/50 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-100/40 dark:focus:ring-primary-500/30',
            error ? 'border-danger focus:border-danger focus:ring-red-100 dark:focus:ring-red-500/30' : 'border-surface-200 dark:border-surface-700',
            className,
          )}
          id={id}
          ref={ref}
          {...props}
        />
        {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
      </label>
    );
  },
);

Input.displayName = 'Input';
