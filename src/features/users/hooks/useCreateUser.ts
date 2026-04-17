import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createUser } from '@/api/users.api';
import type { CreateUserRequest, User } from '@/types/user.types';

/**
 * Hook para crear usuarios y refrescar la lista paginada.
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<User, unknown, CreateUserRequest>({
    mutationFn: createUser,
    onSuccess: async () => {
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
