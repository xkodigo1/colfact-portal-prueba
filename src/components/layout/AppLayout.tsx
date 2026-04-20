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
    <div className="mx-auto flex h-screen max-w-[1600px] flex-col gap-4 px-4 py-4 lg:flex-row">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <Header onMenuToggle={() => setIsSidebarOpen((current) => !current)} />
        <main className="flex min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
