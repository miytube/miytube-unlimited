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
          {/* bg-background on the centered column so vignette wallpaper ads can show in the side gutters.
              Shadow + ring give the column a clear edge so videos stay readable over any ad color. */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[1400px] bg-background shadow-[0_0_40px_rgba(0,0,0,0.35)] ring-1 ring-border/60">
            {children}
          </div>
        </main>
        <Footer />
      </div>
      <QuickCreatePageWidget />
      
    </div>
  );
};
