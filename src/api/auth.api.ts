import { apiClient } from '@/lib/axios';
import type { LoginRequest, LoginResponse } from '@/types/auth.types';

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);

  return data;
};
