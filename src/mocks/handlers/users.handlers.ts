import { http, HttpResponse } from 'msw';

import { MOCK_USERS } from '@/mocks/data/users.data';
import type { UserRole } from '@/types/auth.types';
import type { User } from '@/types/user.types';

const MOCK_USERS_STORAGE_KEY = 'colfact:mock-users';

const getInitialUsers = (): User[] => {
  try {
    const storedUsers = window.localStorage.getItem(MOCK_USERS_STORAGE_KEY);

    if (!storedUsers) {
      return [...MOCK_USERS];
    }

    const parsedUsers = JSON.parse(storedUsers) as User[];

    if (!Array.isArray(parsedUsers)) {
      return [...MOCK_USERS];
    }

    return parsedUsers;
  } catch {
    return [...MOCK_USERS];
  }
};

const persistUsers = (nextUsers: User[]): void => {
  window.localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(nextUsers));
};

let users = getInitialUsers();
let nextId = users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;

export const usersHandlers = [
  http.get('*/api/users', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const role = url.searchParams.get('role') as UserRole | null;
    const isActive = url.searchParams.get('isActive');
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '5');

    const filteredUsers = users.filter((user) => {
      const matchesSearch =
        !search ||
        user.fullName.toLowerCase().includes(search) ||
        user.identification.includes(search) ||
        user.userName.toLowerCase().includes(search);
      const matchesRole = !role || user.role === role;
      const matchesIsActive = isActive === null || user.isActive === (isActive === 'true');

      return matchesSearch && matchesRole && matchesIsActive;
    });

    const total = filteredUsers.length;
    const start = (page - 1) * pageSize;

    return HttpResponse.json({
      data: filteredUsers.slice(start, start + pageSize),
      total,
      page,
      pageSize,
    });
  }),
  http.get('*/api/users/:id', ({ params }) => {
    const userId = Number(params.id);
    const user = users.find((item) => item.id === userId);

    if (!user) {
      return HttpResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    return HttpResponse.json(user);
  }),
  http.post('*/api/users', async ({ request }) => {
    const body = (await request.json()) as Omit<User, 'id'>;

    if (users.some((user) => user.userName === body.userName)) {
      return HttpResponse.json({ message: 'El nombre de usuario ya existe' }, { status: 409 });
    }

    if (users.some((user) => user.email === body.email)) {
      return HttpResponse.json({ message: 'El correo electrónico ya existe' }, { status: 409 });
    }

    const newUser: User = {
      id: nextId++,
      ...body,
    };

    users = [newUser, ...users];
    persistUsers(users);

    return HttpResponse.json(newUser, { status: 201 });
  }),
];
