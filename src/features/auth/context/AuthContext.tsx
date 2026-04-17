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

const getInitialUser = (): AuthUser | null => {
  const token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    clearAuthTokens();
    return null;
  }

  return buildAuthUserFromToken(token);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(() => getInitialUser());

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
