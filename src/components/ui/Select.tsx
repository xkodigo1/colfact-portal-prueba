import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label: string;
}

export const Select = ({ children, className, error, id, label, ...props }: SelectProps) => {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-surface-700" htmlFor={id}>
      <span>{label}</span>
      <select
        className={cn(
          'rounded-2xl border bg-white px-4 py-3 text-sm text-surface-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100',
          error ? 'border-danger focus:border-danger focus:ring-red-100' : 'border-surface-200',
          className,
        )}
        id={id}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
};
