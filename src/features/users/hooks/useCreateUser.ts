import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createUser } from '@/api/users.api';
import type { CreateUserRequest, User } from '@/types/user.types';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * Hook de mutacion: useCreateUser
 *
 * RESPONSABILIDADES:
 * 1. Ejecutar POST /api/users con datos del formulario
 * 2. Invalidar el cache de usuarios para refresco automatico
 * 3. Retornar isPending, error, reset para que el formulario controle UX
 *
 * DECISION: ¿Por qué invalidateQueries en lugar de setQueryData?
 * → setQueryData requiere saber exactamente qué data agregó el servidor.
 * → invalidateQueries marca como "stale" todas las queries que comienzan
 *   con ['users'], sin importar si estan en pagina 1, 2 o con filtros.
 * → React Query refetch automaticamente y la tabla se actualiza al instante.
 * → Si hay 10 tabs abiertos con distintos filtros, todos se refrescan.
 *
 * DECISION: ¿Por qué onSuccess en lugar de .then()?
 * → onSuccess se dispara solo si mutationFn NO lanza error.
 * → Si hay un 409 (username existe), el .then() nunca se ejecuta.
 * → Esto asegura que solo refrescamos el cache si la creacion fue exitosa.
 * ═════════════════════════════════════════════════════════════════════════
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
