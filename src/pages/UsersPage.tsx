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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_420px]">
      <section className="space-y-6">
        <Card>
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
                : 'Aún no hay usuarios disponibles en la lista simulada.'
            }
            title="Sin resultados"
          />
        ) : null}
        {!isLoading && !isError && users.length > 0 ? (
          <>
            <UsersTable users={users} />
            <div className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-panel">
              <UsersPagination page={page} setPage={setPage} total={total} totalPages={totalPages} />
            </div>
          </>
        ) : null}
      </section>

      <aside className="order-last xl:order-none">
        <UserCreateForm />
      </aside>
    </div>
  );
};
