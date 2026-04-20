import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * GUARDA DE RUTAS (Route Guard)
 *
 * DECISION: ¿Por qué es un componente y no middleware?
 * → React Router v6 no tiene middleware (como Express).
 * → Los componentes que wrappean <Outlet> actuan como guardas.
 * → Si isAuthenticated es false, renderiza <Navigate> en lugar de <Outlet>.
 *
 * DECISION: ¿Por qué replace={true}?
 * → Sin replace, el historial guarda: login → dashboard → login (atras)
 * → Con replace, no se puede volver atras al login (mejor UX).
 * → El usuario ve la navegacion como "logico" sin rutas olvidadas.
 *
 * DECISION: ¿Por qué no mostrar un spinner mientras se valida?
 * → AuthProvider valida en el root de la app (main.tsx).
 * → isAuthenticated ya esta disponible al instante.
 * → Si el token expiro, getInitialUser() retorna null inmediatamente.
 * → No hay latencia, no necesita spinner.
 *
 * RIESGO: ¿Qué pasa si el usuario manipula localStorage?
 * → El token se adjunta en Authorization header.
 * → El backend valida la signature: si es falso, 401 inmediato.
 * → Luego el interceptor dispara un logout reactivo.
 * → La manipulacion local no bypasea validacion del servidor.
 * ═════════════════════════════════════════════════════════════════════════
 */
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};
