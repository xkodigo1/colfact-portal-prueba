import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={cn('rounded-3xl border border-white/70 bg-white/90 p-6 shadow-panel backdrop-blur', className)} {...props}>
      {children}
    </div>
  );
};
