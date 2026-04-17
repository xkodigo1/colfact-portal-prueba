import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchUsers } from '@/api/users.api';
import { useDebounce } from '@/hooks/useDebounce';
import type { UserListParams } from '@/types/user.types';

const DEFAULT_PAGE_SIZE = 5;

/**
 * Hook para obtener la lista paginada de usuarios con filtros y búsqueda.
 */
export const useUsers = () => {
  const [search, setSearch] = useState<string>('');
  const [role, setRole] = useState<UserListParams['role']>(undefined);
  const [isActive, setIsActive] = useState<UserListParams['isActive']>(undefined);
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 350);

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
