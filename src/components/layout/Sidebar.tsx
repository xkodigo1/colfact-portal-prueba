import { NavLink } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/utils/cn';

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Usuarios', to: '/users' },
] as const;

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="flex w-full flex-col justify-between rounded-[2rem] bg-surface-900 p-6 text-white shadow-panel lg:min-h-[calc(100vh-3rem)] lg:w-72">
      <div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-100">Colfact</p>
          <h1 className="mt-3 text-2xl font-bold">Portal Administrativo</h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Gestión de emisores, usuarios y operación documental certificada.
          </p>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white',
                  isActive && 'bg-primary-600 text-white',
                )
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-medium text-white/65">Sesión activa</p>
        <p className="mt-2 text-lg font-semibold">{user?.fullName ?? 'Sin sesión'}</p>
        <div className="mt-3">
          <Badge className="bg-white/10 text-white" tone="neutral">
            {user?.role ?? 'Invitado'}
          </Badge>
        </div>
      </div>
    </aside>
  );
};
