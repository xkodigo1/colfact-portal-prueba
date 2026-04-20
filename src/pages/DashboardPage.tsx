import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/hooks/useAuth';

const highlights = [
  { label: 'Módulos activos', value: '02', detail: 'Autenticación y administración de usuarios.' },
  { label: 'Stack validado', value: '100%', detail: 'React, TypeScript, Query, Zod, Tailwind y MSW.' },
  { label: 'Fuente de datos', value: 'MSW', detail: 'API simulada con contratos tipados y estados visibles.' },
] as const;

const quickActions = [
  { title: 'Revisar usuarios activos', detail: 'Verifica emisores y visualizadores habilitados.', to: '/users' },
  { title: 'Crear nueva cuenta', detail: 'Usa el panel lateral para registrar un usuario operativo.', to: '/users' },
  { title: 'Auditar accesos', detail: 'Confirma roles y permisos antes de la revisión técnica.', to: '/users' },
] as const;

const recentActivity = [
  'Login administrativo disponible con sesión reactiva.',
  'Módulo de usuarios con filtros y paginación listo para revisión.',
  'Despliegue público activo en GitHub Pages para validación externa.',
] as const;

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <Card className="overflow-hidden bg-gradient-to-br from-primary-700 via-primary-700 to-surface-900 py-5 text-white dark:from-[#123e79] dark:via-[#0d2f5e] dark:to-[#050d17]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Bienvenido</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{user?.fullName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
          Esta vista centraliza el acceso al portal administrativo de Colfact y sirve como punto de entrada para
          la operación de usuarios dentro de la prueba técnica.
        </p>
        <Link
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-surface-900 transition hover:bg-surface-100"
          to="/users"
        >
          Ir a usuarios
        </Link>
      </Card>

      <section className="grid gap-3 md:grid-cols-3">
        {highlights.map((item) => (
          <Card className="p-5" key={item.label}>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-100/80">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-100">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-surface-700 dark:text-surface-100/70">{item.detail}</p>
          </Card>
        ))}
      </section>

      <section className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="min-h-0 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">Accesos rápidos</p>
              <h2 className="mt-1 text-xl font-bold text-surface-900 dark:text-surface-100">Siguientes acciones recomendadas</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            {quickActions.map((item) => (
              <Link
                className="rounded-3xl border border-surface-200 bg-surface-50 px-5 py-4 transition hover:border-primary-200 hover:bg-primary-50 dark:border-surface-700 dark:bg-surface-700/45 dark:hover:border-primary-700 dark:hover:bg-primary-900/30"
                key={item.title}
                to={item.to}
              >
                <p className="text-base font-semibold text-surface-900 dark:text-surface-100">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-surface-700 dark:text-surface-100/75">{item.detail}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="min-h-0 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">Actividad reciente</p>
          <h2 className="mt-1 text-xl font-bold text-surface-900 dark:text-surface-100">Estado del entorno</h2>
          <div className="mt-4 space-y-3">
            {recentActivity.map((item, index) => (
              <div className="flex gap-4" key={item}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-100">
                  {index + 1}
                </div>
                <p className="pt-0.5 text-sm leading-6 text-surface-700 dark:text-surface-100/75">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
