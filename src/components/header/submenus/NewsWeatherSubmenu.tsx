
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Cloud, Waves, Zap } from 'lucide-react';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const NewsWeatherSubmenu: React.FC = () => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-2">
        <Globe size={16} />
        <span>News & Weather</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>
          <Link to="/news" className="flex items-center gap-2 w-full">
            <Globe size={16} />
            <span>News & Politics</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/weather" className="flex items-center gap-2 w-full">
            <Cloud size={16} />
            <span>Weather</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/oceans" className="flex items-center gap-2 w-full">
            <Waves size={16} />
            <span>Oceans</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/disasters" className="flex items-center gap-2 w-full">
            <Zap size={16} />
            <span>Disasters</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
