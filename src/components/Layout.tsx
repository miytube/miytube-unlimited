import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuickCreatePageWidget } from './admin/QuickCreatePageWidget';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isMobile ? '' : 'ml-60'}`}>
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1">
          {/* bg-background on the centered column so vignette wallpaper ads can show in the side gutters */}
          <div className="container mx-auto px-4 sm:px-6 max-w-[1400px] bg-background">
            {children}
          </div>
        </main>
        <Footer />
      </div>
      <QuickCreatePageWidget />
    </div>
  );
};
