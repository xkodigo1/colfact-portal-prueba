import { Link } from 'react-router-dom';

import { UserRoleBadge } from '@/features/users/components/UserRoleBadge';
import { UserStatusBadge } from '@/features/users/components/UserStatusBadge';
import type { User } from '@/types/user.types';

interface UsersTableProps {
  users: User[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-panel">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-200 text-left text-sm">
          <thead className="bg-surface-50 text-surface-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Usuario</th>
              <th className="px-6 py-4 font-semibold">Identificación</th>
              <th className="px-6 py-4 font-semibold">Rol</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {users.map((user) => (
              <tr className="transition hover:bg-primary-50/50" key={user.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-surface-900">{user.fullName}</p>
                  <p className="text-surface-700">{user.userName}</p>
                </td>
                <td className="px-6 py-4 text-surface-700">{user.identification}</td>
                <td className="px-6 py-4">
                  <UserRoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4">
                  <UserStatusBadge isActive={user.isActive} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    className="inline-flex rounded-2xl px-4 py-2.5 text-sm font-semibold text-surface-700 transition hover:bg-surface-100 hover:text-surface-900"
                    to={`/users/${user.id}`}
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
