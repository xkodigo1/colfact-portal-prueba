import type { UserRole } from '@/types/auth.types';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * TIPOS DE USUARIOS Y PAGINACION
 *
 * DECISION: ¿Por qué hay tipos separados para User y CreateUserRequest?
 * → User tiene id (asignado por backend), CreateUserRequest no lo tiene.
 * → Este patron previene que el frontend envie un id falso en POST.
 * → Zod schema para CreateUserRequest valida antes de enviar.
 *
 * DECISION: ¿Por qué PaginatedResponse es generica<T>?
 * → Se puede reutilizar para cualquier entidad: PaginatedResponse<User>,
 *   PaginatedResponse<Document>, PaginatedResponse<Config>.
 * → Reduce duplicacion de tipos en el futuro.
 * → UserListResponse = PaginatedResponse<User> es un alias para claridad.
 *
 * DECISION: ¿Por qué UserListParams tiene search, role, isActive opcionales?
 * → El usuario puede filtrar por solo nombre, solo rol, o combinar filtros.
 * → Si search no se envia (undefined), el backend/mock ignora ese filtro.
 * → Esto da flexibilidad maxima sin requerir valores por defecto.
 * ═════════════════════════════════════════════════════════════════════════
 */

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
