import { useQuery } from '@tanstack/react-query';

import { fetchUser } from '@/api/users.api';

/**
 * Consulta el detalle solo cuando existe un id valido.
 * retry:false evita repetir 404 innecesarios en una vista puntual.
 */
export const useUser = (id: number | null) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id as number),
    enabled: id !== null,
    retry: false,
  });
};
