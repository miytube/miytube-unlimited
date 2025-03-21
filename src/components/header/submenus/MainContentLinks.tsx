
import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Music, FileText, Newspaper } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
    </>
  );
};
