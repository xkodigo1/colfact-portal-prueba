import { apiClient } from '@/lib/axios';
import type { CreateUserRequest, User, UserListParams, UserListResponse } from '@/types/user.types';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * CAPA HTTP DE USUARIOS
 *
 * DECISION: ¿Por qué tres funciones (list, detail, create) y no una?
 * → Cada operacion tiene diferente proposito y datos.
 * → Facilita testeo: fetchUsers() se testea sin tocar createUser().
 * → Si el backend cambia /users/{id} a /users/details/{id}, cambio aqui.
 * → Cada funcion hace una cosa y la hace bien (Single Responsibility).
 * ═════════════════════════════════════════════════════════════════════════
 */

/**
 * LIST: Usuarios paginados y filtrados
 *
 * DECISION: ¿Por qué los filtros van en params (query string)?
 * → GET requests con query params son cacheables por navegador/proxy.
 * → React Query usa la query key completa (incluyendo params) para cache.
 * → Si pasara filtros en body, violarria convenciones REST.
 *
 * COMO FUNCIONA:
 * - useUsers() construye UserListParams con search, role, isActive
 * - axios envia: GET /api/users?page=1&search=diana&role=Issuer
 * - El mock valida y retorna data[] + total
 * - React Query cachea por ['users', params]
 */
export const fetchUsers = async (params: UserListParams): Promise<UserListResponse> => {
  const { data } = await apiClient.get<UserListResponse>('/users', {
    params,
  });

  return data;
};

/**
 * DETAIL: Usuario individual por ID
 *
 * DECISION: ¿Por qué no usar fetchUsers con id en params?
 * → Semantica REST: GET /users/{id} es standard para detalle.
 * → useUser() crea query key ['users', id] (cache separada).
 * → Si la API fuera /search?id=1, seria confuso.
 *
 * MANEJO DE ERRORES:
 * - 404 si el usuario no existe
 * - useQuery con retry: false para no reintentar 404
 */
export const fetchUser = async (id: number): Promise<User> => {
  const { data } = await apiClient.get<User>(`/users/${id}`);

  return data;
};

/**
 * CREATE: Nuevo usuario con validacion de conflictos
 *
 * DECISION: ¿Por qué POST en lugar de PUT/PATCH?
 * → POST crea recursos nuevos (no existe ID aun).
 * → PUT seria para reemplazo completo (existente).
 * → PATCH seria para actualizacion parcial.
 *
 * VALIDACION:
 * - 409 Conflict si userName ya existe
 * - 409 Conflict si email ya existe (en mock)
 * - 400 BadRequest si campos requeridos faltan (Zod)
 *
 * REFRESCO AUTOMATICO:
 * - useCreateUser() invalida ['users'] al exito
 * - Todas las listas cacheadas se refrescan
 * - El usuario ve el nuevo usuario sin recargar pagina
 */
export const createUser = async (payload: CreateUserRequest): Promise<User> => {
  const { data } = await apiClient.post<User>('/users', payload);

  return data;
};
