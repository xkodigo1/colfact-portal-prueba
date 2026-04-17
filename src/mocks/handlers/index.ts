import { authHandlers } from '@/mocks/handlers/auth.handlers';
import { usersHandlers } from '@/mocks/handlers/users.handlers';

export const handlers = [...authHandlers, ...usersHandlers];
