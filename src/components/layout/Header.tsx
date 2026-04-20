import { useState } from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/utils/cn';

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
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState<boolean>(() => document.documentElement.classList.contains('dark'));
  const current = titleMap[location.pathname] ?? {
    title: 'Detalle de usuario',
    description: 'Consulta informacion consolidada del usuario seleccionado.',
  };

  // Persistimos el tema en localStorage para respetar la preferencia del
  // usuario al recargar y aplicarlo antes de montar toda la UI.
  const toggleTheme = (): void => {
    setIsDark((current) => {
      const nextTheme = !current;

      document.documentElement.classList.toggle('dark', nextTheme);
      document.documentElement.style.colorScheme = nextTheme ? 'dark' : 'light';
      window.localStorage.setItem('colfact:theme', nextTheme ? 'dark' : 'light');

      return nextTheme;
    });
  };

  return (
    <header
      className={cn(
        'rounded-[1.8rem] border px-5 py-4 shadow-panel backdrop-blur transition-colors',
        isDark ? 'border-surface-700 bg-surface-900/95' : 'border-white/70 bg-white/92',
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">{current.title}</p>
            <p className={cn('mt-2 text-sm', isDark ? 'text-surface-100/80' : 'text-surface-700')}>
              {current.description}
            </p>
          </div>
          <Button className="lg:hidden" onClick={onMenuToggle} variant="secondary">
            Menu
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="group relative">
            <Button
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="h-10 w-10 px-0"
              onClick={toggleTheme}
              variant="secondary"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <span className="pointer-events-none absolute right-0 top-[calc(100%+0.5rem)] z-20 whitespace-nowrap rounded-xl border border-surface-200 bg-white px-2.5 py-1 text-xs font-medium text-surface-900 opacity-0 shadow-panel transition group-hover:opacity-100 group-focus-within:opacity-100 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100">
              {isDark ? 'Cambiar a claro' : 'Cambiar a oscuro'}
            </span>
          </div>
          <div className="group relative">
            <Button aria-label="Cerrar sesion" className="h-10 w-10 px-0" onClick={logout} variant="secondary">
              <LogOut className="h-4 w-4" />
            </Button>
            <span className="pointer-events-none absolute right-0 top-[calc(100%+0.5rem)] z-20 whitespace-nowrap rounded-xl border border-surface-200 bg-white px-2.5 py-1 text-xs font-medium text-surface-900 opacity-0 shadow-panel transition group-hover:opacity-100 group-focus-within:opacity-100 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100">
              Cerrar sesion
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
