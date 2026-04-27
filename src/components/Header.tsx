import React from 'react';
import { Logo } from './header/Logo';
import { UserActions } from './header/UserActions';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b w-full">
      <div className="mx-auto flex items-center justify-between px-4 h-16 gap-4">
        <div className="flex items-center gap-2">
          {onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Logo />
        </div>
        <UserActions />
      </div>
    </header>
  );
};
