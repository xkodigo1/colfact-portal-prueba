import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { UserDetailPage } from '@/pages/UserDetailPage';
import { UsersPage } from '@/pages/UsersPage';
import { ProtectedRoute } from '@/router/ProtectedRoute';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * DEFINICION DE RUTAS
 *
 * DECISION: ¿Por qué /login esta fuera del ProtectedRoute?
 * → LoginPage necesita acceso aunque el usuario no este autenticado.
 * → Si lo meteamos dentro de ProtectedRoute, nadie podria acceder a login.
 * → El flujo es: /login (publico) → autenticar → /dashboard (protegido)
 *
 * DECISION: ¿Por qué el root "/" redirige a "/dashboard"?
 * → Evita un arbol de rutas vacio. Si alguien accede a /,
 *   React Router maneja la navegacion a /dashboard.
 * → El usuario no ve una pagina en blanco.
 *
 * DECISION: ¿Por qué AppLayout envuelve todas las rutas protegidas?
 * → AppLayout contiene Header, Sidebar y el <Outlet>.
 * → Solo se renderiza cuando el usuario esta autenticado.
 * → Las paginas (Dashboard, Users, etc.) viven dentro del layout.
 *
 * DECISION: ¿Por qué * al final redirige a /?
 * → Catch-all para rutas invalidas (/invalid, /typo, etc.).
 * → Redirige a / que luego redirige a /dashboard (logica consistente).
 * ═════════════════════════════════════════════════════════════════════════
 */
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};
