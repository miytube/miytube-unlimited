
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { LogoPlaceholder } from './LogoPlaceholder';
import { UploadProgressIndicator } from './upload/UploadProgressIndicator';

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
      {/* Remove the logo section that was crossing the sidebar */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main content area */}
        <div className="flex flex-col flex-1">
          {/* Header is within the main content area, not overlapping the sidebar */}
          <Header />
          
          <main className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
              {children}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
      
      {/* Upload progress indicator - fixed position */}
      <UploadProgressIndicator />
    </div>
  );
};
