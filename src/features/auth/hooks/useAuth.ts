import { useContext } from 'react';

import { AuthContext } from '@/features/auth/context/auth-context';
import type { AuthContextValue } from '@/types/auth.types';

/**
 * Hook para consumir el estado reactivo de autenticación de la aplicación.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
