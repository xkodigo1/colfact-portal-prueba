import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

import { UserRoleBadge } from '@/features/users/components/UserRoleBadge';
import { UserStatusBadge } from '@/features/users/components/UserStatusBadge';
import type { User } from '@/types/user.types';

interface UsersTableProps {
  users: User[];
}

/**
 * Tabla presentacional del modulo. Recibe datos listos para pintar y deja
 * fuera cualquier detalle de fetching, filtros o paginacion.
 */
export const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-panel dark:border-surface-700 dark:bg-surface-900/90">
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <table className="w-full divide-y divide-surface-200 text-left text-sm dark:divide-surface-700">
          <thead className="bg-surface-50 text-surface-700 dark:bg-surface-700/50 dark:text-surface-100/80">
            <tr>
              <th className="px-6 py-4 font-semibold">Usuario</th>
              <th className="px-6 py-4 font-semibold">Identificacion</th>
              <th className="px-6 py-4 font-semibold">Rol</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold text-right">Accion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
            {users.map((user) => (
              <tr className="transition hover:bg-surface-50 dark:hover:bg-surface-700/40" key={user.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-surface-900 dark:text-surface-100">{user.fullName}</p>
                  <p className="text-surface-700 dark:text-surface-100/70">{user.userName}</p>
                </td>
                <td className="px-6 py-4 text-surface-700 dark:text-surface-100/70">{user.identification}</td>
                <td className="px-6 py-4">
                  <UserRoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4">
                  <UserStatusBadge isActive={user.isActive} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="group relative inline-flex">
                    <Link
                      aria-label={`Ver detalle de ${user.fullName}`}
                      // Accion compacta para no ensanchar columnas; el texto
                      // visible se muestra en tooltip para mantener claridad.
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-surface-700 transition hover:bg-surface-100 hover:text-surface-900 dark:text-surface-100/80 dark:hover:bg-surface-700 dark:hover:text-surface-100"
                      to={`/users/${user.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <span className="pointer-events-none absolute right-0 top-[calc(100%+0.5rem)] z-20 whitespace-nowrap rounded-xl border border-surface-200 bg-white px-2.5 py-1 text-xs font-medium text-surface-900 opacity-0 shadow-panel transition group-hover:opacity-100 group-focus-within:opacity-100 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100">
                      Ver detalle
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
