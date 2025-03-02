
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, User, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CategoryDropdown } from './CategoryDropdown';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
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
      <Header />
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isWatchPage ? 'pt-0' : 'pt-4'} px-4 md:px-6 ${isHome ? 'pb-6' : 'pb-16'}`}>
          <div className={`w-full max-w-7xl mx-auto ${isWatchPage ? '' : 'animate-fade-in'}`}>
            {/* Category Management Button - only show on certain pages */}
            {!isWatchPage && location.pathname.includes('/upload') && (
              <div className="mb-6">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="mb-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {showCategories ? 'Hide Categories' : 'Manage Categories'}
                </button>
                
                {showCategories && <CategoryDropdown />}
              </div>
            )}
            
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
