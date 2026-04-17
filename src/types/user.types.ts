import type { UserRole } from '@/types/auth.types';

export interface User {
  id: number;
  fullName: string;
  userName: string;
  identification: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface UserListParams {
  page: number;
  pageSize: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type UserListResponse = PaginatedResponse<User>;

export interface CreateUserRequest {
  fullName: string;
  userName: string;
  identification: string;
  email: string;
  role: UserRole;
  password: string;
  isActive: boolean;
}
