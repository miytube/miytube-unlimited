
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Image, Music, FileText, Newspaper, BookOpen, 
  Moon, GraduationCap, Leaf, Smile, Globe, Cloud, Waves, Zap 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

export const ContentDropdown: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors">Content</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/images" className="flex items-center gap-2 w-full">
            <Image size={16} />
            <span>Images</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/audio" className="flex items-center gap-2 w-full">
            <Music size={16} />
            <span>Audio</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
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
        
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/documents" className="flex items-center gap-2 w-full">
            <FileText size={16} />
            <span>Documents</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/blog" className="flex items-center gap-2 w-full">
            <Newspaper size={16} />
            <span>Blog</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
