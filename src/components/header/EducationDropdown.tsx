
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Stethoscope, BookOpen, HeartPulse, School, Gavel } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const EducationDropdown: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Education</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-4 w-[500px]">
              <div>
                <h3 className="font-medium text-sm mb-2 text-muted-foreground">Educational Topics</h3>
                <div className="space-y-1.5">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education/american-history" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span>American History</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education/biblical-history" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Biblical History</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education/bible-quotes" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Bible Quotes</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education" 
                      className="flex items-center justify-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 rounded-md text-sm mt-2"
                    >
                      <span>View all Education categories</span>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2 text-muted-foreground">Professional Education</h3>
                <div className="space-y-1.5">
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education/medicine" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Stethoscope className="h-4 w-4" />
                      <span>Medicine & Medication</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education/religion" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Religion</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education/nursing" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <HeartPulse className="h-4 w-4" />
                      <span>Nursing & Healthcare</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education/learn" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <School className="h-4 w-4" />
                      <span>Learning Techniques</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education/doctor" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Stethoscope className="h-4 w-4" />
                      <span>Doctor & Medical Practice</span>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/education/lawyer" 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm"
                    >
                      <Gavel className="h-4 w-4" />
                      <span>Lawyer & Attorney</span>
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
