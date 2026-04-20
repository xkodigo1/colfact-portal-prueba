import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { UserCreateForm } from '@/features/users/components/UserCreateForm';
import { UsersFilters } from '@/features/users/components/UsersFilters';
import { UsersPagination } from '@/features/users/components/UsersPagination';
import { UsersTable } from '@/features/users/components/UsersTable';
import { useUsers } from '@/features/users/hooks/useUsers';
import { getApiErrorMessage } from '@/utils/auth';

/**
 * Pagina contenedora del modulo de usuarios. Solo compone bloques visuales
 * y estados de UI; la logica de datos vive en hooks especializados.
 */
export const UsersPage = () => {
  const {
    users,
    total,
    page,
    totalPages,
    search,
    role,
    isActive,
    isLoading,
    isError,
    error,
    refetch,
    setSearch,
    setRole,
    setIsActive,
    setPage,
  } = useUsers();

  const hasFilters = Boolean(search || role || typeof isActive === 'boolean');

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_390px]">
      <section className="space-y-4">
        <Card className="p-5">
          <UsersFilters
            isActive={isActive}
            role={role}
            search={search}
            setIsActive={setIsActive}
            setRole={setRole}
            setSearch={setSearch}
          />
        </Card>

        {isLoading ? <TableSkeleton rows={5} /> : null}
        {isError ? (
          <ErrorState
            message={getApiErrorMessage(error, 'No fue posible cargar la lista de usuarios.')}
            onAction={() => {
              void refetch();
            }}
          />
        ) : null}
        {!isLoading && !isError && users.length === 0 ? (
          <EmptyState
            message={
              hasFilters
                ? 'No se encontraron usuarios que coincidan con los filtros actuales.'
                : 'Aun no hay usuarios disponibles en la lista simulada.'
            }
            title="Sin resultados"
          />
        ) : null}
        {!isLoading && !isError && users.length > 0 ? (
          <div className="space-y-3">
            {/* La tabla y la paginacion solo aparecen cuando ya hay datos
                validos para dejar claros los estados loading/error/empty. */}
            <UsersTable users={users} />
            <div className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-panel dark:border-surface-700 dark:bg-surface-900/80">
              <UsersPagination page={page} setPage={setPage} total={total} totalPages={totalPages} />
            </div>
          </div>
        ) : null}
      </section>

      <aside className="order-last min-h-0 xl:order-none">
        <UserCreateForm />
      </aside>
    </div>
  );
};
