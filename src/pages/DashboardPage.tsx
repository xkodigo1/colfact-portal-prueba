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
    <div className="space-y-6">
      <Card className="overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-surface-900 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Bienvenido</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{user?.fullName}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
          Esta vista centraliza el acceso al portal administrativo de Colfact y sirve como punto de entrada para
          la operación de usuarios dentro de la prueba técnica.
        </p>
        <Link
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-surface-900 transition hover:bg-surface-100"
          to="/users"
        >
          Ir a usuarios
        </Link>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.label}>
            <p className="text-sm font-medium text-surface-700">{item.label}</p>
            <p className="mt-4 text-4xl font-bold text-surface-900">{item.value}</p>
            <p className="mt-3 text-sm leading-6 text-surface-700">{item.detail}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">Accesos rápidos</p>
              <h2 className="mt-2 text-2xl font-bold text-surface-900">Siguientes acciones recomendadas</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {quickActions.map((item) => (
              <Link
                className="rounded-3xl border border-surface-200 bg-surface-50 px-5 py-5 transition hover:border-primary-200 hover:bg-primary-50"
                key={item.title}
                to={item.to}
              >
                <p className="text-base font-semibold text-surface-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-surface-700">{item.detail}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">Actividad reciente</p>
          <h2 className="mt-2 text-2xl font-bold text-surface-900">Estado del entorno</h2>
          <div className="mt-6 space-y-4">
            {recentActivity.map((item, index) => (
              <div className="flex gap-4" key={item}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-surface-700">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
