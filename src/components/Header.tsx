import React from 'react';
import { Logo } from './header/Logo';
import { UserActions } from './header/UserActions';
import { NavigationLinks } from './header/NavigationLinks';
import { SearchBar } from './SearchBar';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b w-full">
      {/* Top row: Logo + centered SearchBar + UserActions */}
      <div className="mx-auto flex items-center px-4 h-16 gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          {onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Logo />
        </div>
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-2xl hidden md:block">
            <SearchBar />
          </div>
        </div>
        <div className="flex-shrink-0">
          <UserActions />
        </div>
      </div>
      {/* Second row: Navigation links */}
      <div className="px-4 pb-2 hidden md:flex justify-center">
        <NavigationLinks />
      </div>
    </header>
  );
};
