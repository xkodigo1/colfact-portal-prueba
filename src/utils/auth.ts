import axios, { type AxiosError } from 'axios';

import type { ApiError, AuthUser, JwtPayload } from '@/types/auth.types';

/**
 * CONSTANTES DE PERSISTENCIA
 * 
 * Mantener las claves de storage en un solo lugar evita typos y facilita
 * cambios: si necesito renombrar 'accessToken' a 'sessionToken', se cambia
 * una sola linea y se refactorea automáticamente en toda la app.
 */
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const AUTH_FORCE_LOGOUT_EVENT = 'auth:force-logout';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * ═════════════════════════════════════════════════════════════════════════
 * DECODIFICACION DE JWT
 *
 * Un JWT tiene la forma: header.payload.signature
 * - header: metadatos (algoritmo, tipo)
 * - payload: datos (sub, role, fullName, exp, etc.)
 * - signature: validacion del servidor
 *
 * Para verificar integridad, el backend necesitaria validar la signature.
 * Para reconstruir la sesion local, solo necesitamos el payload.
 *
 * DECISION: ¿Por qué decodificar localmente en lugar de pedir /me?
 * → Performance: el JWT ya tiene toda la informacion.
 * → Sin latencia: el usuario ve su nombre al instante en mount.
 * → Si token es falso, la primera llamada a API rechazara (validacion real).
 *
 * DECISION: ¿Por qué decodeBase64Url con normalizacion?
 * → Base64Url usa - y _ en lugar de + y /
 * → Necesitamos convertir de vuelta para usar atob()
 * → El padding de = es obligatorio para atob()
 * ═════════════════════════════════════════════════════════════════════════
 */

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded = padding ? normalized.padEnd(normalized.length + (4 - padding), '=') : normalized;

  return atob(padded);
};

/**
 * ACCESOS A STORAGE
 *
 * Los accesos al storage se concentran aqui para evitar claves duplicadas
 * y para hacer explicita la politica de persistencia de la sesion.
 */
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

/**
 * SINCRONIZACION ENTRE COMPONENTES
 *
 * El interceptor HTTP (lib/axios.ts) no tiene acceso a React ni el contexto.
 * Cuando responde 401, no puede ejecutar navigate() directamente.
 * 
 * Solucion: Dispara un evento custom que el AuthProvider escucha.
 * 
 * DECISION: ¿Por qué evento custom y no un callback?
 * → Desacopla axios (sin dependencias React) de AuthProvider.
 * → Multiples listeners pueden reaccionar al mismo evento.
 * → Es el patron estandar del navegador (Storage event, etc.).
 */
export const notifyForcedLogout = (): void => {
  window.dispatchEvent(new Event(AUTH_FORCE_LOGOUT_EVENT));
};

/**
 * PARSING DEL JWT
 *
 * Extrae el payload del JWT y lo convierte a JSON.
 * Si el token esta malformado, retorna null (no crashea).
 *
 * SEGURIDAD: Esta decodificacion es solo para UX, no valida integridad.
 * La validacion real ocurre en el backend cuando se adjunta el token en
 * Authorization header: si la signature no es valida, 401 inmediato.
 */
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

/**
 * VALIDACION DE EXPIRACION
 *
 * El campo 'exp' en el JWT es un timestamp en segundos (UNIX epoch).
 * Comparamos exp * 1000 (ms) con Date.now() (ms actual).
 *
 * DECISION: ¿Por qué considerar token invalido si falta exp?
 * → Un JWT sin expiracion es riesgoso (nunca vence).
 * → Si parseJwtPayload fallo o el payload esta vacio, tratamos como expirado.
 * → Esto fuerza un logout reactivo y evita confusiones.
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};

/**
 * RECONSTRUCCION DEL USUARIO
 *
 * Deriva AuthUser a partir del JWT para mantener una unica fuente de verdad.
 * Si faltan campos obligatorios (sub, fullName, role), retorna null.
 *
 * DECISION: ¿Por qué requerir sub, fullName, role?
 * → Son la informacion minima para mostrar al usuario en Header/Sidebar.
 * → Si faltan, el contexto no sabe a quien renderizar.
 * → userName es opcional porque el backend podria no incluirlo.
 */
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

/**
 * NORMALIZACION DE ERRORES
 *
 * Las llamadas HTTP pueden fallar por muchas razones:
 * - Zod validation error: 400 (el frontend envio datos invalidos)
 * - 401: token expirado o revocado
 * - 409: resource duplicado (username ya existe)
 * - Network error: timeout o sin conexion
 * - Unknown error: algo inesperado en el servidor
 *
 * Esta funcion convierte cualquier error a un mensaje legible para mostrar
 * en UI. Tiene fallbacks para evitar mostrar [object Object].
 */
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
