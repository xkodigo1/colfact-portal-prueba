import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

/**
 * Shell del area autenticada. Maneja el sidebar movil y deja el contenido
 * variable a cargo del router mediante Outlet.
 */
export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 lg:flex-row">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-h-full flex-1 flex-col gap-6">
        <Header onMenuToggle={() => setIsSidebarOpen((current) => !current)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
