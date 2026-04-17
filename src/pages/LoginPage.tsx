import { Card } from '@/components/ui/Card';

export const LoginPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600">Colfact</p>
        <h1 className="mt-4 text-3xl font-bold text-surface-900">Foundation del portal</h1>
        <p className="mt-3 text-sm leading-7 text-surface-700">
          Esta primera etapa deja listo el stack, la estructura del proyecto y los componentes base para
          construir autenticación y usuarios.
        </p>
      </Card>
    </main>
  );
};
