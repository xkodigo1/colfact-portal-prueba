import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/hooks/useAuth';

const highlights = [
  { label: 'Módulos activos', value: '02', detail: 'Autenticación y administración de usuarios.' },
  { label: 'Stack validado', value: '100%', detail: 'React, TypeScript, Query, Zod, Tailwind y MSW.' },
  { label: 'Fuente de datos', value: 'MSW', detail: 'API simulada con contratos tipados y estados visibles.' },
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
    </div>
  );
};
