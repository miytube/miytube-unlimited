
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { LogoPlaceholder } from './LogoPlaceholder';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isWatchPage = location.pathname.startsWith('/watch');
  
  return (
    <div className="min-h-screen flex flex-col">
      <LogoPlaceholder />
      <Header />
      
      <div className="flex flex-1 w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 w-full">
          <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};
