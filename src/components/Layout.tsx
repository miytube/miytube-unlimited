
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex flex-col flex-1">
          <Header />
          
          <main className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
              {children}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
};
