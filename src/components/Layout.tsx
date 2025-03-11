
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, User, X, Image } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CategoryDropdown } from './categories/CategoryDropdown';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showLogoPlacement, setShowLogoPlacement] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isWatchPage = location.pathname.startsWith('/watch');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 w-full">
          <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};
