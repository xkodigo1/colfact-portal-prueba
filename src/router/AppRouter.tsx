import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { UserDetailPage } from '@/pages/UserDetailPage';
import { UsersPage } from '@/pages/UsersPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  );
};
