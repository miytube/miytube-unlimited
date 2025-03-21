
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, BookOpen, Moon, GraduationCap, Leaf, Smile } from 'lucide-react';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const AudioSubmenu: React.FC = () => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-2">
        <Music size={16} />
        <span>Audio Categories</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>
          <Link to="/podcasts" className="flex items-center gap-2 w-full">
            <Music size={16} />
            <span>Podcasts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/audiobooks" className="flex items-center gap-2 w-full">
            <BookOpen size={16} />
            <span>Audiobooks</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/meditation" className="flex items-center gap-2 w-full">
            <Moon size={16} />
            <span>Meditation</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/educational" className="flex items-center gap-2 w-full">
            <GraduationCap size={16} />
            <span>Educational</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/nature-sounds" className="flex items-center gap-2 w-full">
            <Leaf size={16} />
            <span>Nature Sounds</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/comedy" className="flex items-center gap-2 w-full">
            <Smile size={16} />
            <span>Comedy</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
