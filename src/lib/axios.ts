import axios from 'axios';

import { clearAuthTokens, getAccessToken, notifyForcedLogout } from '@/utils/auth';

/**
 * Cliente HTTP centralizado. Toda llamada a la API usa este objeto para
 * compartir configuracion, autenticacion y manejo global de errores.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  // El token se adjunta en un solo sitio para evitar repetir esta logica
  // en cada modulo o componente que haga llamadas HTTP.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Un 401 invalida toda la sesion. Limpiamos storage y notificamos al
    // AuthProvider para que la UI reaccione antes de la siguiente navegacion.
    if (error.response?.status === 401) {
      clearAuthTokens();
      notifyForcedLogout();
    }

    return Promise.reject(error);
  },
);
