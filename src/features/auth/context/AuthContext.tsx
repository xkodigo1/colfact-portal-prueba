import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { login as loginRequest } from '@/api/auth.api';
import { AuthContext } from '@/features/auth/context/auth-context';
import type { AuthContextValue, AuthUser, LoginRequest, LoginResponse } from '@/types/auth.types';
import {
  ACCESS_TOKEN_KEY,
  AUTH_FORCE_LOGOUT_EVENT,
  buildAuthUserFromToken,
  clearAuthTokens,
  getAccessToken,
  isTokenExpired,
  notifyForcedLogout,
  setAuthTokens,
} from '@/utils/auth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Fallback por si el token no pudiera reconstruir completamente al usuario.
 * En condiciones normales el JWT ya contiene lo necesario.
 */
const buildUserFromLogin = (response: LoginResponse): AuthUser | null => {
  const tokenUser = buildAuthUserFromToken(response.accessToken);

  if (tokenUser) {
    return tokenUser;
  }

  return {
    id: 0,
    fullName: response.fullName,
    role: response.role,
    userName: response.fullName.toLowerCase().replace(/\s+/g, '.'),
  };
};

/**
 * Hidrata la sesion al recargar la aplicacion. Si el token ya expiro, se
 * limpia storage para evitar que el layout renderice datos obsoletos.
 *
 * DECISION: ¿Por qué se valida expiracion aqui?
 * → Si el usuario cierra navegador 3 horas y reabre, getAccessToken() trae
 *   un token expirado. Sin esta validacion, el JWT se decodificaria con un
 *   exp falso y el usuario veria su nombre pero no podria hacer API calls
 *   (interceptor add Bearer token a 401).
 */
const getInitialUser = (): AuthUser | null => {
  const token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    clearAuthTokens();
    return null;
  }

  return buildAuthUserFromToken(token);
};

/**
 * ═════════════════════════════════════════════════════════════════════════
 * Provider global de autenticacion
 *
 * RESPONSABILIDADES:
 * 1. Hidrata sesion al recargar (getInitialUser)
 * 2. Mantiene estado reactivo de usuario en toda la app
 * 3. Encapsula login() (credenciales → JWT → navegacion)
 * 4. Encapsula logout() (limpia storage + notifica + navega)
 * 5. Escucha eventos externos: storage, interceptor 401, fuerza logout
 * 6. Sincroniza cambios entre tabs (event listener storage)
 *
 * DECISION: ¿Por qué el contexto y no Redux/Zustand?
 * → El estado de autenticacion es simple (user | null).
 * → Context API con hooks es suficiente y mas lightweight.
 * → Si en futuro hay 20+ campos de usuario, ya se puede migrar a Zustand.
 *
 * DECISION: ¿Por qué notifyForcedLogout()?
 * → El interceptor de axios vive en lib/axios.ts (sin acceso a navigate).
 * → Cuando responde 401, el interceptor dispara un evento custom.
 * → El listener aqui recibe el evento y desencadena logout reactivo.
 * → Esto desacopla la logica HTTP de la logica de sesion.
 * ═════════════════════════════════════════════════════════════════════════
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(() => getInitialUser());

  // Reutilizamos la misma regla de navegacion para logout manual, expiracion
  // y cierres de sesion forzados disparados por interceptores HTTP.
  const handleLogoutNavigation = useCallback((): void => {
    if (location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleForcedLogout = useCallback((): void => {
    clearAuthTokens();
    setUser(null);
    handleLogoutNavigation();
  }, [handleLogoutNavigation]);

  useEffect(() => {
    const syncAuthState = (): void => {
      const token = getAccessToken();

      if (!token || isTokenExpired(token)) {
        setUser(null);
        clearAuthTokens();
        return;
      }

      setUser(buildAuthUserFromToken(token));
    };

    const handleStorage = (event: StorageEvent): void => {
      if (event.key === ACCESS_TOKEN_KEY) {
        syncAuthState();
      }
    };

    const handleForceLogout = (): void => {
      handleForcedLogout();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(AUTH_FORCE_LOGOUT_EVENT, handleForceLogout);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(AUTH_FORCE_LOGOUT_EVENT, handleForceLogout);
    };
  }, [handleForcedLogout]);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    const response = await loginRequest(credentials);

    // Guardamos tokens antes de navegar para que ProtectedRoute, Header y
    // Sidebar vean inmediatamente el estado autenticado correcto.
    setAuthTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    setUser(buildUserFromLogin(response));
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  const logout = useCallback((): void => {
    clearAuthTokens();
    setUser(null);

    // El evento permite sincronizar listeners reactivos aunque el logout se
    // origine fuera del contexto, por ejemplo desde un interceptor.
    notifyForcedLogout();
    handleLogoutNavigation();
  }, [handleLogoutNavigation]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      isAuthenticated: Boolean(user),
      user,
      login,
      logout,
    };
  }, [login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
