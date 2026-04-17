import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  actionLabel?: string;
  message: string;
  title: string;
  onAction?: () => void;
}

export const EmptyState = ({ actionLabel, message, onAction, title }: EmptyStateProps) => {
  return (
    <div className="rounded-3xl border border-dashed border-surface-200 bg-white/80 p-8 text-center shadow-panel">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        0
      </div>
      <h3 className="mt-4 text-lg font-semibold text-surface-900">{title}</h3>
      <p className="mt-2 text-sm text-surface-700">{message}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
