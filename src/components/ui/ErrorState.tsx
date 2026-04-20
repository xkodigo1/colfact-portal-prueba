import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  actionLabel?: string;
  message: string;
  onAction?: () => void;
  title?: string;
}

export const ErrorState = ({
  actionLabel = 'Intentar de nuevo',
  message,
  onAction,
  title = 'Ocurrió un problema',
}: ErrorStateProps) => {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/70 p-8 shadow-panel dark:border-red-900/60 dark:bg-red-950/35">
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">{title}</h3>
      <p className="mt-2 text-sm text-red-600 dark:text-red-200">{message}</p>
      {onAction ? (
        <Button className="mt-6" onClick={onAction} variant="danger">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
