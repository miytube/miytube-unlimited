import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarContext } from '@/context/SidebarContext';
import { QuickCreatePageWidget } from './admin/QuickCreatePageWidget';
import { AdSlot } from './ads/AdSlot';
import { SloganTicker, SloganBanner } from './branding/SloganVariants';


interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isHome = useLocation().pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isMobile ? '' : isCollapsed ? 'ml-16' : 'ml-60'}`}>
        {/* Slogan preview — Variant B (top ticker) */}
        {isHome && <SloganTicker />}
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
        {/* Top ad stays below navigation on every screen size. */}
        <div className="flex min-w-0 justify-center bg-background border-b border-border/60 px-2 py-2">
          <AdSlot
            slot="4004758990"
            format="horizontal"
            responsive={false}
            label="Sponsored"
            className="!rounded-none max-w-[728px]"
            style={{ width: '100%', maxWidth: isMobile ? 320 : 728, height: isMobile ? 100 : 90, minHeight: isMobile ? 100 : 90 }}
            insStyle={{ height: isMobile ? 100 : 90, minHeight: isMobile ? 100 : 90 }}
          />
        </div>
        {/* Slogan preview — Variant C (dedicated banner) */}
        {isHome && <SloganBanner />}
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
