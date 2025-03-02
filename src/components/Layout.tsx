
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, User, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isWatchPage = location.pathname.startsWith('/watch');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-1">
              <span className="text-primary font-bold text-2xl">Miy</span>
              <span className="font-bold text-2xl">Tube</span>
            </Link>
          </div>
          
          {!isMobile && (
            <div className="w-2/5">
              <SearchBar />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {isMobile && (
              <Link to="/search" className="p-2 rounded-full hover:bg-secondary transition-colors">
                <Search size={20} />
              </Link>
            )}
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
        
        {isMobile && location.pathname === '/search' && (
          <div className="px-4 py-2 bg-background border-b">
            <SearchBar />
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isWatchPage ? 'pt-0' : 'pt-4'} px-4 md:px-6 ${isHome ? 'pb-6' : 'pb-16'}`}>
          <div className={`w-full max-w-7xl mx-auto ${isWatchPage ? '' : 'animate-fade-in'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
