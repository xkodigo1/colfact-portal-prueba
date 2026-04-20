import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import { queryClient } from '@/lib/queryClient';
import { AppRouter } from '@/router/AppRouter';

import './index.css';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * ARQUITECTURA GLOBAL DE COLFACT PORTAL
 *
 * Flujo de inicializacion:
 * 1. enableMocking() → MSW solo en desarrollo (isomorphic fetch interception)
 * 2. renderApp() → Monta providers en orden correcto
 * 3. AuthProvider → Hidrata sesion desde localStorage y sincroniza cambios
 * 4. AppRouter → Protege rutas con ProtectedRoute
 * 5. QueryClient → Maneja cache y sincronizacion de datos
 *
 * DECISION: ¿Por qué los providers estan anidados asi?
 * → AuthProvider necesita estar dentro de QueryClientProvider porque el
 *   contexto puede invalidar queries al logout. Pero también fuera de
 *   BrowserRouter porque necesita acceso a navigate() en mount/unmount.
 * → BrowserRouter envuelve AppRouter para que React Router funcione.
 *
 * DECISION: ¿Por qué MSW solo en dev?
 * → En produccion, las API reales responden. En dev, MSW intercepta con
 *   fetch de forma transparente (sin cambios de codigo).
 * ═════════════════════════════════════════════════════════════════════════
 */

/**
 * GitHub Pages no resuelve rutas SPA como /login o /users/1.
 * El fallback 404 redirige a /?p=... y aqui restauramos la ruta real
 * antes de montar React Router.
 */
const restoreGithubPagesRoute = (): void => {
  const currentUrl = new URL(window.location.href);
  const redirectedPath = currentUrl.searchParams.get('p');

  if (!redirectedPath) {
    return;
  }

  const redirectedSearch = currentUrl.searchParams.get('q') ?? '';
  const redirectedHash = currentUrl.searchParams.get('h') ?? '';
  const nextUrl = `${decodeURIComponent(redirectedPath)}${decodeURIComponent(redirectedSearch)}${decodeURIComponent(redirectedHash)}`;

  window.history.replaceState(null, '', nextUrl);
};

/**
 * Los mocks se levantan solo en desarrollo. En build publica el mismo
 * punto de entrada funciona, pero sin interceptar llamadas con MSW.
 */
const enableMocking = async (): Promise<void> => {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  await worker.start({
    onUnhandledRequest: 'bypass',
  });
};

/**
 * Punto de montaje unico de la app. Aqui viven todos los providers globales:
 * React Query para data fetching, Router para navegacion y AuthProvider para
 * sincronizar la sesion en toda la UI.
 */
const renderApp = (): void => {
  restoreGithubPagesRoute();

  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
        {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </StrictMode>,
  );
};

enableMocking().then(renderApp).catch(renderApp);
