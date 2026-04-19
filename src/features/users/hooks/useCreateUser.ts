import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createUser } from '@/api/users.api';
import type { CreateUserRequest, User } from '@/types/user.types';

/**
 * Encapsula la mutacion de creacion y el refresco posterior de la tabla.
 * La pagina solo consume estados simples y no detalles de cache.
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<User, unknown, CreateUserRequest>({
    mutationFn: createUser,
    onSuccess: async () => {
      // Invalidar por prefijo actualiza cualquier lista cacheada bajo users,
      // incluso si estaba filtrada o en otra pagina.
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    createUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};
