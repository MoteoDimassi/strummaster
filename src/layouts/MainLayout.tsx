import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../shared/components';
import { TunerModal } from '../features/tuner/components/TunerModal';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground selection:bg-primary/30 w-full overflow-x-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      <Footer />
      <TunerModal />
    </div>
  );
};