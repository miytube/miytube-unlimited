
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, User, X, Image } from 'lucide-react';
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
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isWatchPage ? 'pt-0' : 'pt-4'} px-4 md:px-6 lg:px-8 ${isHome ? 'pb-6' : 'pb-16'}`}>
          <div className={`w-full max-w-7xl mx-auto ${isWatchPage ? '' : 'animate-fade-in'}`}>
            {/* Category and Logo Management Buttons - only show on certain pages */}
            {!isWatchPage && location.pathname.includes('/upload') && (
              <div className="mb-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="mb-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {showCategories ? 'Hide Categories' : 'Manage Categories'}
                </button>
                
                <button
                  onClick={() => setShowLogoPlacement(!showLogoPlacement)}
                  className="mb-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {showLogoPlacement ? 'Hide Logo Placement' : 'Logo Placement'}
                </button>
                
                {showCategories && <CategoryDropdown />}
                
                {showLogoPlacement && (
                  <div className="w-full p-4 border rounded-md shadow-sm bg-background">
                    <h3 className="text-lg font-medium mb-3">Logo Placement Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Image size={20} className="text-primary" />
                          <h4 className="font-medium">Channel Logo</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Upload your channel logo to display on your videos and profile.</p>
                        <div className="flex items-center justify-center w-full">
                          <label htmlFor="channel-logo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/30 hover:bg-secondary/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Image size={32} className="text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Click to upload logo</p>
                              <p className="text-xs text-muted-foreground">(PNG, JPG, SVG up to 2MB)</p>
                            </div>
                            <input id="channel-logo" type="file" className="hidden" accept="image/*" />
                          </label>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Image size={20} className="text-primary" />
                          <h4 className="font-medium">Video Watermark</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Upload a watermark to display on your videos.</p>
                        <div className="flex items-center justify-center w-full">
                          <label htmlFor="video-watermark" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/30 hover:bg-secondary/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Image size={32} className="text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Click to upload watermark</p>
                              <p className="text-xs text-muted-foreground">(PNG with transparency)</p>
                            </div>
                            <input id="video-watermark" type="file" className="hidden" accept="image/png" />
                          </label>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-2">Watermark Position</h4>
                        <select className="w-full p-2 border rounded-md">
                          <option value="bottom-right">Bottom Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="top-left">Top Left</option>
                          <option value="center">Center</option>
                        </select>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-2">Watermark Opacity</h4>
                        <input type="range" min="10" max="100" defaultValue="70" className="w-full" />
                        <div className="flex justify-between text-xs mt-1">
                          <span>10%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                        Save Logo Settings
                      </button>
                    </div>
                  </div>
                )}
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
