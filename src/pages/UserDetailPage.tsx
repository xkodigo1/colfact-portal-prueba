import { Link, useParams } from 'react-router-dom';

import { ErrorState } from '@/components/ui/ErrorState';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { UserDetailCard } from '@/features/users/components/UserDetailCard';
import { useUser } from '@/features/users/hooks/useUser';
import { getApiErrorMessage } from '@/utils/auth';

export const UserDetailPage = () => {
  const { id } = useParams();
  const parsedId = id ? Number(id) : Number.NaN;
  const userId = Number.isInteger(parsedId) ? parsedId : null;
  const { data, isLoading, isError, error, refetch } = useUser(userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">Usuarios</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-100">Detalle de usuario</h1>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-2xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-semibold text-surface-900 transition hover:bg-surface-100 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:hover:bg-surface-700"
          to="/users"
        >
          Volver al listado
        </Link>
      </div>

      {userId === null ? <ErrorState message="El identificador del usuario no es válido." /> : null}
      {userId !== null && isLoading ? <TableSkeleton rows={4} /> : null}
      {userId !== null && isError ? (
        <ErrorState
          message={getApiErrorMessage(error, 'No fue posible obtener el detalle del usuario.')}
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}
      {userId !== null && !isLoading && !isError && data ? <UserDetailCard user={data} /> : null}
    </div>
  );
};
