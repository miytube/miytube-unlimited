
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, Video, Film, Music, Image, 
  FileText, Newspaper, BookOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UploadDropdown: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Upload size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Upload Content</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/upload" className="flex items-center gap-2 w-full font-medium text-primary">
            <Upload size={16} />
            <span>Universal Upload</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/upload/video" className="flex items-center gap-2 w-full">
            <Video size={16} />
            <span>Upload Video</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/shorts" className="flex items-center gap-2 w-full">
            <Film size={16} />
            <span>Upload Shorts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/long-videos" className="flex items-center gap-2 w-full">
            <Video size={16} />
            <span>Upload Long Video</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/upload/music" className="flex items-center gap-2 w-full">
            <Music size={16} />
            <span>Upload Music</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/podcasts" className="flex items-center gap-2 w-full">
            <Music size={16} />
            <span>Upload Podcast</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/audiobooks" className="flex items-center gap-2 w-full">
            <BookOpen size={16} />
            <span>Upload Audiobook</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/images" className="flex items-center gap-2 w-full">
            <Image size={16} />
            <span>Upload Image</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/documents" className="flex items-center gap-2 w-full">
            <FileText size={16} />
            <span>Upload Document</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/blog/new" className="flex items-center gap-2 w-full">
            <Newspaper size={16} />
            <span>New Blog Post</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
