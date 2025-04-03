
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MainContentLinks } from './submenus/MainContentLinks';
import { AudioSubmenu } from './submenus/AudioSubmenu';
import { NewsWeatherSubmenu } from './submenus/NewsWeatherSubmenu';
import { FilmCategories } from './FilmCategories';

export const ContentDropdown: React.FC = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors">Content</DropdownMenuTrigger>
        <DropdownMenuContent>
          <MainContentLinks />
          <DropdownMenuSeparator />
          <AudioSubmenu />
          <DropdownMenuSeparator />
          <NewsWeatherSubmenu />
        </DropdownMenuContent>
      </DropdownMenu>
      
      <FilmCategories />
    </>
  );
};
