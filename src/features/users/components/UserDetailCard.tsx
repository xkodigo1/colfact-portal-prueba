import { Card } from '@/components/ui/Card';
import { UserRoleBadge } from '@/features/users/components/UserRoleBadge';
import { UserStatusBadge } from '@/features/users/components/UserStatusBadge';
import type { User } from '@/types/user.types';

interface UserDetailCardProps {
  user: User;
}

export const UserDetailCard = ({ user }: UserDetailCardProps) => {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-surface-200 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 text-white dark:border-surface-700">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Detalle de usuario</p>
        <h1 className="mt-3 text-3xl font-bold">{user.fullName}</h1>
        <p className="mt-2 text-sm text-white/80">@{user.userName}</p>
      </div>

      <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-100/75">Correo</p>
          <p className="mt-1 text-base font-semibold text-surface-900 dark:text-surface-100">{user.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-100/75">Identificación</p>
          <p className="mt-1 text-base font-semibold text-surface-900 dark:text-surface-100">{user.identification}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-100/75">Rol</p>
          <div className="mt-2">
            <UserRoleBadge role={user.role} />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-100/75">Estado</p>
          <div className="mt-2">
            <UserStatusBadge isActive={user.isActive} />
          </div>
        </div>
      </div>
    </Card>
  );
};
