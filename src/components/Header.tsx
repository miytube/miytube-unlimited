
import React from 'react';
import { Logo } from './header/Logo';
import { UserActions } from './header/UserActions';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b w-full">
      <div className="mx-auto flex items-center justify-between px-4 h-16">
        <Logo />
        <UserActions />
      </div>
    </header>
  );
};
