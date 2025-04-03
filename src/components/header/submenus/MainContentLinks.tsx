
import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Music, FileText, Newspaper, Film, Utensils, GraduationCap, Laugh, Clapperboard, Mountain, Microscope, Gavel } from 'lucide-react';
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export const MainContentLinks: React.FC = () => {
  return (
    <>
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
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem>
        <Link to="/education" className="flex items-center gap-2 w-full">
          <GraduationCap size={16} />
          <span>Education</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/entertainment" className="flex items-center gap-2 w-full">
          <Clapperboard size={16} />
          <span>Entertainment</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/film" className="flex items-center gap-2 w-full">
          <Film size={16} />
          <span>Film</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/film-animation" className="flex items-center gap-2 w-full">
          <Clapperboard size={16} />
          <span>Film & Animation</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/film-movies" className="flex items-center gap-2 w-full">
          <Film size={16} />
          <span>Film & Movies</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/foods" className="flex items-center gap-2 w-full">
          <Utensils size={16} />
          <span>Foods</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/fungi" className="flex items-center gap-2 w-full">
          <Mountain size={16} />
          <span>Fungi</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/funny" className="flex items-center gap-2 w-full">
          <Laugh size={16} />
          <span>Funny</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/courts" className="flex items-center gap-2 w-full">
          <Gavel size={16} />
          <span>Courts</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/courts-police" className="flex items-center gap-2 w-full">
          <Gavel size={16} />
          <span>Courts & Police</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/science-tech" className="flex items-center gap-2 w-full">
          <Microscope size={16} />
          <span>Science & Technology</span>
        </Link>
      </DropdownMenuItem>
    </>
  );
};
