
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Clapperboard, Drama, Laugh, Heart, Sword, Castle } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const FilmCategories: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Film Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-4 w-[500px]">
              <div>
                <h3 className="font-medium text-sm mb-2 text-muted-foreground">Film</h3>
                <div className="space-y-1.5">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film/romance" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Romance</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film/action-crime-thriller" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Sword className="h-4 w-4" />
                      <span>Action, Crime & Thriller</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film/comedy" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Laugh className="h-4 w-4" />
                      <span>Comedy</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film/drama" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Drama className="h-4 w-4" />
                      <span>Drama</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film" 
                      className="flex items-center justify-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 rounded-md text-sm mt-2"
                    >
                      <span>View all Film categories</span>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2 text-muted-foreground">Film & Animation</h3>
                <div className="space-y-1.5">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film-animation/action" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Sword className="h-4 w-4" />
                      <span>Action Animation</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film-animation/comedy" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Laugh className="h-4 w-4" />
                      <span>Comedy Animation</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film-animation/fantasy-drama" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Castle className="h-4 w-4" />
                      <span>Fantasy & Drama Animation</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film-animation/cartoons" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Clapperboard className="h-4 w-4" />
                      <span>Cartoons</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/film-animation" 
                      className="flex items-center justify-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 rounded-md text-sm mt-2"
                    >
                      <span>View all Animation categories</span>
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
