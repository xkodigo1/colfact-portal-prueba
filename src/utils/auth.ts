import axios, { type AxiosError } from 'axios';

import type { ApiError, AuthUser, JwtPayload } from '@/types/auth.types';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const AUTH_FORCE_LOGOUT_EVENT = 'auth:force-logout';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded = padding ? normalized.padEnd(normalized.length + (4 - padding), '=') : normalized;

  return atob(padded);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setAuthTokens = ({ accessToken, refreshToken }: AuthTokens): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const notifyForcedLogout = (): void => {
  window.dispatchEvent(new Event(AUTH_FORCE_LOGOUT_EVENT));
};

export const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};

export const buildAuthUserFromToken = (token: string): AuthUser | null => {
  const payload = parseJwtPayload(token);

  if (!payload?.sub || !payload.fullName || !payload.role) {
    return null;
  }

  return {
    id: Number(payload.sub),
    fullName: payload.fullName,
    role: payload.role,
    userName: payload.userName,
  };
};

export const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    return axiosError.response?.data?.message ?? fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};
