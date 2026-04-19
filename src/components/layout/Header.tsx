import { useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';

const titleMap: Record<string, { description: string; title: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Resumen operativo del portal administrativo.',
  },
  '/users': {
    title: 'Usuarios',
    description: 'Consulta, filtra y crea usuarios de la plataforma.',
  },
};

interface HeaderProps {
  onMenuToggle: () => void;
}

/**
 * Header contextual. Resume la vista actual y concentra acciones globales
 * como el menu movil y el cierre de sesion.
 */
export const Header = ({ onMenuToggle }: HeaderProps) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const current = titleMap[location.pathname] ?? {
    title: 'Detalle de usuario',
    description: 'Consulta informacion consolidada del usuario seleccionado.',
  };

  return (
    <header className="rounded-[2rem] border border-white/70 bg-white/85 px-6 py-5 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">{current.title}</p>
            <p className="mt-2 text-sm text-surface-700">{current.description}</p>
          </div>
          <Button className="lg:hidden" onClick={onMenuToggle} variant="secondary">
            Menu
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-surface-900">{user?.fullName}</p>
            <p className="text-xs text-surface-700">{user?.role}</p>
          </div>
          <Button onClick={logout} variant="secondary">
            Cerrar sesion
          </Button>
        </div>
      </div>
    </header>
  );
};
