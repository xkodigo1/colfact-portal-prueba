import { useQuery } from '@tanstack/react-query';

import { fetchUser } from '@/api/users.api';

/**
 * Hook para consultar el detalle de un usuario por identificador.
 */
export const useUser = (id: number | null) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id as number),
    enabled: id !== null,
    retry: false,
  });
};
