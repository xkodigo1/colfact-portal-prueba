import { NavLink } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/utils/cn';

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Usuarios', to: '/users' },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Navegacion lateral del portal. En desktop queda fija y en mobile funciona
 * como drawer para no ocupar ancho permanente.
 */
export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();

  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={cn(
          'fixed inset-0 z-30 bg-surface-900/50 backdrop-blur-sm transition lg:hidden',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-4 left-4 z-40 flex w-[min(20rem,calc(100vw-2rem))] flex-col justify-between rounded-[2rem] border border-surface-200 bg-surface-100 p-5 text-surface-900 shadow-panel transition duration-200 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 lg:static lg:inset-auto lg:w-72 lg:min-h-[calc(100vh-2rem)] lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0',
        )}
      >
        <div>
          <div className="rounded-3xl border border-surface-200 bg-white/80 p-4 transition-[background-color,border-color,color,box-shadow] duration-300 ease-in-out dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600 dark:text-accent-100">Colfact</p>
            <h1 className="mt-3 text-2xl font-bold">Portal Administrativo</h1>
            <p className="mt-3 text-sm leading-6 text-surface-700 dark:text-white/70">
              Gestion de emisores, usuarios y operacion documental certificada.
            </p>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            {navigationItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'rounded-2xl px-4 py-3 text-sm font-medium text-surface-700 transition hover:bg-surface-200 hover:text-surface-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white',
                    isActive && 'bg-primary-600 font-semibold text-white dark:bg-primary-600',
                  )
                }
                key={item.to}
                onClick={onClose}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-6 rounded-3xl border border-surface-200 bg-white/80 p-4 transition-[background-color,border-color,color,box-shadow] duration-300 ease-in-out dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-medium text-surface-700 dark:text-white/65">Sesion activa</p>
          <p className="mt-2 text-lg font-semibold">{user?.userName ?? 'sin_sesion'}</p>
          <div className="mt-3">
            <Badge className="bg-surface-200 text-surface-800 dark:bg-white/10 dark:text-white" tone="neutral">
              {user?.role ?? 'Invitado'}
            </Badge>
          </div>
          <Button className="mt-5 w-full lg:hidden" onClick={onClose} variant="secondary">
            Cerrar menu
          </Button>
        </div>
      </aside>
    </>
  );
};
