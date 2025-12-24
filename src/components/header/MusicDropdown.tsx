
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Mic2, Radio, Headphones } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const MusicDropdown: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Music</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-4 w-[450px]">
              <div>
                <h3 className="font-medium text-sm mb-2 text-muted-foreground">Music Categories</h3>
                <div className="space-y-1.5">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/music/pop" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Mic2 className="h-4 w-4" />
                      <span>Pop Music</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/music/rock" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Headphones className="h-4 w-4" />
                      <span>Rock</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/music/grunge" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Headphones className="h-4 w-4" />
                      <span>Grunge</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/music/rock-grunge" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Headphones className="h-4 w-4" />
                      <span>Rock Grunge</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/music/alternative-grunge" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Headphones className="h-4 w-4" />
                      <span>Alternative Grunge</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/music/classical" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Radio className="h-4 w-4" />
                      <span>Classical</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/music" 
                      className="flex items-center justify-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 rounded-md text-sm mt-2"
                    >
                      <span>View all Music categories</span>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2 text-muted-foreground">Music Services</h3>
                <div className="space-y-1.5">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/upload/music" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Music className="h-4 w-4" />
                      <span>Upload Music</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/music/playlists" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Music className="h-4 w-4" />
                      <span>Playlists</span>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
