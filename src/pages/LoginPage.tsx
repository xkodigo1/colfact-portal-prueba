import { Navigate } from 'react-router-dom';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(29,111,216,0.16),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(29,111,216,0.24),_transparent_33%)]" />
      <div className="relative flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600">
            CONEXUSIT SAS · Facturación electrónica
          </p>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-100 md:text-5xl">
            Controla emisores, usuarios y trazabilidad documental desde un solo portal.
          </h2>
          <p className="mt-5 text-base leading-7 text-surface-700 dark:text-surface-100/80">
            Esta segunda etapa incorpora autenticación reactiva, rutas protegidas y sincronización de sesión para
            preparar la administración del portal.
          </p>
        </section>

        <LoginForm />
      </div>
    </main>
  );
};
