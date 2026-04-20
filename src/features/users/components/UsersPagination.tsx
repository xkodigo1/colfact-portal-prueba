import { Button } from '@/components/ui/Button';

interface UsersPaginationProps {
  page: number;
  setPage: (page: number) => void;
  total: number;
  totalPages: number;
}

export const UsersPagination = ({ page, setPage, total, totalPages }: UsersPaginationProps) => {
  return (
    <div className="flex flex-col gap-3 border-t border-surface-200 px-6 py-4 text-sm text-surface-700 dark:border-surface-700 dark:text-surface-100/80 md:flex-row md:items-center md:justify-between">
      <p>
        Página <span className="font-semibold text-surface-900 dark:text-surface-100">{page}</span> de{' '}
        <span className="font-semibold text-surface-900 dark:text-surface-100">{totalPages}</span> · {total} registros
      </p>
      <div className="flex gap-2">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="secondary">
          Anterior
        </Button>
        <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)} variant="secondary">
          Siguiente
        </Button>
      </div>
    </div>
  );
};
