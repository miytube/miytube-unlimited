
import React from 'react';
import { Logo } from './header/Logo';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b w-full">
      <div className="mx-auto flex items-center justify-between px-4 h-16">
        <Logo />
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/upload" className="text-primary hover:underline">Upload</Link>
          <Link to="/auth" className="text-muted-foreground hover:text-foreground">Sign In</Link>
        </nav>
      </div>
    </header>
  );
};
