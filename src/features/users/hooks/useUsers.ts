import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchUsers } from '@/api/users.api';
import { useDebounce } from '@/hooks/useDebounce';
import type { UserListParams } from '@/types/user.types';

const DEFAULT_PAGE_SIZE = 5;

/**
 * ═════════════════════════════════════════════════════════════════════════
 * Hook orquestador: useUsers
 *
 * RESPONSABILIDADES:
 * 1. Mantener estado local de filtros (search, role, isActive, page)
 * 2. Aplicar debounce a la busqueda (350ms)
 * 3. Construir params para la API
 * 4. Usar React Query para caching inteligente
 * 5. Calcular total de paginas
 * 6. Reset a pagina 1 cuando cambian filtros
 *
 * DECISION: ¿Por qué debounce en la busqueda?
 * → Si no hubiera debounce, cada keystroke (a, ad, adi, admin) seria una
 *   llamada HTTP. Con 350ms de debounce, el usuario termina de escribir y
 *   recien ahi disparamos fetchUsers().
 * → Ahorra llamadas HTTP y evita flickering de tabla.
 * → Para 1000+ usuarios, la diferencia es Notable.
 *
 * DECISION: ¿Por qué la key incluye params?
 * → React Query crea caches INDEPENDIENTES para cada combinacion:
 *   - ['users', { page: 1, search: 'diana' }]
 *   - ['users', { page: 2, search: 'diana' }]  <- otra cache
 *   - ['users', { page: 1, search: 'carlos' }] <- otra cache
 * → Si usuario busca 'diana', baja a pagina 2, luego busca 'carlos' y
 *   vuelve a 'diana', React Query retorna los datos cacheados al instante.
 *
 * DECISION: ¿Por qué reset a pagina 1 cuando cambian filtros?
 * → Si estabas en pagina 3 con 20 resultados y cambias el rol a Admin
 *   (5 resultados), la pagina 3 ya no existe.
 * → Esto evita confusiones y blancos innecesarios.
 * ═════════════════════════════════════════════════════════════════════════
 */
export const useUsers = () => {
  const [search, setSearch] = useState<string>('');
  const [role, setRole] = useState<UserListParams['role']>(undefined);
  const [isActive, setIsActive] = useState<UserListParams['isActive']>(undefined);
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 350);

  // La key incluye filtros y pagina para que React Query administre caches
  // separadas por cada combinacion visible en pantalla.
  const params: UserListParams = {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: debouncedSearch || undefined,
    role,
    isActive,
  };

  const query = useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  });

  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  return {
    users: query.data?.data ?? [],
    total,
    page,
    totalPages,
    search,
    role,
    isActive,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    setSearch: (value: string) => {
      // Si cambian los filtros, volvemos a la pagina 1 para evitar navegar
      // a paginas que ya no existen con la nueva cantidad de resultados.
      setSearch(value);
      setPage(1);
    },
    setRole: (value?: UserListParams['role']) => {
      setRole(value);
      setPage(1);
    },
    setIsActive: (value?: boolean) => {
      setIsActive(value);
      setPage(1);
    },
    setPage: (nextPage: number) => setPage(nextPage),
  };
};
