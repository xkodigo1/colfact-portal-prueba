import axios from 'axios';

import { clearAuthTokens, getAccessToken, notifyForcedLogout } from '@/utils/auth';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * Cliente HTTP centralizado (Axios)
 *
 * RESPONSABILIDADES:
 * 1. Base URL y timeout configurados en un solo lugar
 * 2. Interceptor REQUEST: Adjunta token JWT automaticamente
 * 3. Interceptor RESPONSE: Maneja 401 con logout reactivo
 *
 * DECISION: ¿Por qué interceptores y no pasar el token en cada llamada?
 * → DRY: El token se adjunta una sola vez, no en 20 archivos diferentes.
 * → Si cambia el header Authorization a otro nombre, se cambia en un sitio.
 * → El 401 se maneja globalmente: no importa cual endpoint lo retorna.
 *
 * DECISION: ¿Por qué notifyForcedLogout() en lugar de directo a clearTokens?
 * → El interceptor no tiene acceso a useNavigate() (vive fuera de React).
 * → Disparamos un evento custom para que AuthProvider (con navigate) reaccione.
 * → Esto desacopla HTTP layer de React navigation layer.
 *
 * DECISION: ¿Por qué reject(error) sin retornar la promise?
 * → El componente que hace la llamada necesita saber que falló.
 * → La pagina o hook puede capturar el error y mostrar feedback.
 * ═════════════════════════════════════════════════════════════════════════
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTOR REQUEST: Adjunta token JWT automaticamente
 * 
 * El token vive en localStorage. Cada request HTTP lo recupera y lo envia
 * en el header Authorization: Bearer <token>.
 * 
 * SEGURIDAD: El token se refresca? En este mock, no. En produccion seria
 * necesario un refresh token flow, pero para la prueba tecnica solo usamos
 * access token con expiracion en 1 hora (mock).
 */
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  // El token se adjunta en un solo sitio para evitar repetir esta logica
  // en cada modulo o componente que haga llamadas HTTP.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * INTERCEPTOR RESPONSE: Maneja 401 Unauthorized
 * 
 * Un 401 significa que el token no es valido o expiro. Esto puede ocurrir:
 * 1. Token expiro naturalmente (ej: usuario dejo abierto 2 horas)
 * 2. Token fue revocado en el backend (otro admin lo cancelo)
 * 3. Usuario perdio permisos (cambio de rol)
 * 
 * En cualquier caso, limpiamos storage y notificamos al AuthProvider para
 * que ejecute un logout reactivo antes de que React re-renderice.
 */
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
