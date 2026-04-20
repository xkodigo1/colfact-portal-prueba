import { http, HttpResponse } from 'msw';

const VALID_CREDENTIALS = {
  userName: 'admin',
  password: 'Admin123!',
} as const;

const createMockToken = (): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: '3',
      role: 'Admin',
      fullName: 'Administrador',
      userName: 'admin',
      exp: 9_999_999_999,
    }),
  );

  return `${header}.${payload}.mock_signature`;
};

export const authHandlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { password: string; userName: string };

    if (body.userName === VALID_CREDENTIALS.userName && body.password === VALID_CREDENTIALS.password) {
      return HttpResponse.json({
        accessToken: createMockToken(),
        refreshToken: 'mock-refresh-token-abc123',
        role: 'Admin',
        fullName: 'Administrador',
      });
    }

    return HttpResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
  }),
];
