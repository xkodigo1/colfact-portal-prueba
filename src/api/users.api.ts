import { apiClient } from '@/lib/axios';
import type { CreateUserRequest, User, UserListParams, UserListResponse } from '@/types/user.types';

/**
 * Lista paginada y filtrada de usuarios.
 */
export const fetchUsers = async (params: UserListParams): Promise<UserListResponse> => {
  const { data } = await apiClient.get<UserListResponse>('/users', {
    params,
  });

  return data;
};

/**
 * Detalle de un usuario para la vista dedicada /users/:id.
 */
export const fetchUser = async (id: number): Promise<User> => {
  const { data } = await apiClient.get<User>(`/users/${id}`);

  return data;
};

/**
 * Crea un usuario. La actualizacion de la tabla se resuelve en el hook de
 * mutacion invalidando la cache de React Query.
 */
export const createUser = async (payload: CreateUserRequest): Promise<User> => {
  const { data } = await apiClient.post<User>('/users', payload);

  return data;
};
