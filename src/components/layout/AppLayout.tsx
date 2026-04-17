import { Outlet } from 'react-router-dom';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export const AppLayout = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 lg:flex-row">
      <Sidebar />
      <div className="flex min-h-full flex-1 flex-col gap-6">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
