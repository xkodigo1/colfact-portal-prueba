import { apiClient } from '@/lib/axios';
import type { CreateUserRequest, User, UserListParams, UserListResponse } from '@/types/user.types';

export const fetchUsers = async (params: UserListParams): Promise<UserListResponse> => {
  const { data } = await apiClient.get<UserListResponse>('/users', {
    params,
  });

  return data;
};

export const fetchUser = async (id: number): Promise<User> => {
  const { data } = await apiClient.get<User>(`/users/${id}`);

  return data;
};

export const createUser = async (payload: CreateUserRequest): Promise<User> => {
  const { data } = await apiClient.post<User>('/users', payload);

  return data;
};
