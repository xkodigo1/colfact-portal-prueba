import { apiClient } from '@/lib/axios';
import type { LoginRequest, LoginResponse } from '@/types/auth.types';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * CAPA HTTP DE AUTENTICACION
 *
 * RESPONSABILIDAD UNICA: Hacer la llamada POST y retornar el response.
 * No contiene logica de UI, contexto, ni efectos secundarios.
 *
 * DECISION: ¿Por qué separar API layer de hooks?
 * → API layer: Contrato HTTP puro (tipos, rutas, metodos)
 * → Hook layer: Logica de React (state, cache, side effects)
 * → Ejemplo: Si necesito testear, puedo mockear login() sin React.
 * → Si necesito cambiar la ruta /auth/login a /v2/auth/login, cambio aqui.
 *
 * DECISION: ¿Por qué no es un servicio (clase)?
 * → Funciones puras son mas simples que clases.
 * → No hay estado interno (cada llamada es independiente).
 * → Es mas facil de testear y refactorar.
 *
 * DECISION: ¿Por qué apiClient en lugar de fetch directo?
 * → apiClient tiene los interceptores (token, 401, etc.).
 * → Si usara fetch, tendria que adjuntar token manualmente aqui.
 * → Concentrar la logica HTTP en un lugar evita repeticion.
 * ═════════════════════════════════════════════════════════════════════════
 */
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);

  return data;
};
