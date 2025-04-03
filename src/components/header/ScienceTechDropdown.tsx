
import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, Cpu, Robot, Mountain } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const ScienceTechDropdown: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Science & Tech</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-4 w-[500px]">
              <div>
                <h3 className="font-medium text-sm mb-2 text-muted-foreground">Science</h3>
                <div className="space-y-1.5">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/science-tech/artifacts" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Mountain className="h-4 w-4" />
                      <span>Artifacts & Antiques</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/science-tech" 
                      className="flex items-center justify-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 rounded-md text-sm mt-2"
                    >
                      <span>View all Science categories</span>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2 text-muted-foreground">Technology</h3>
                <div className="space-y-1.5">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/science-tech/ai" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Cpu className="h-4 w-4" />
                      <span>Artificial Intelligence</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/science-tech/humanoid-robots" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Robot className="h-4 w-4" />
                      <span>Humanoid Robots</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/science-tech/robots" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Robot className="h-4 w-4" />
                      <span>Robots</span>
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
