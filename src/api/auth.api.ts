import { apiClient } from '@/lib/axios';
import type { LoginRequest, LoginResponse } from '@/types/auth.types';

/**
 * Capa HTTP del login. Aqui no hay logica de UI ni manejo de formularios:
 * solo un contrato claro entre el frontend y el endpoint de autenticacion.
 */
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);

  return data;
};
