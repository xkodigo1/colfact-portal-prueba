import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/70 bg-white/90 p-5 shadow-panel backdrop-blur dark:border-surface-700 dark:bg-surface-900/80',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
