import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface PageContainerProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function PageContainer({ children, showSidebar = true }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-dark-50">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
