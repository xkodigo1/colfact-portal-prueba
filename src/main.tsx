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

const enableMocking = async (): Promise<void> => {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  await worker.start({
    onUnhandledRequest: 'bypass',
  });
};

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
