import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../shared/components';
import { TunerModal } from '../features/tuner/components/TunerModal';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100 selection:bg-amber-500/30 w-full overflow-x-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-8 w-full">
        <Outlet />
      </main>

      <Footer />
      <TunerModal />
    </div>
  );
};