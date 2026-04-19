import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * Guarda de navegacion para todo el espacio autenticado.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};
