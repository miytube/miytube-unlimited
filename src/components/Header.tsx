
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, User, Home, Video, Image, FileText, Music, Newspaper, 
  DollarSign, ShoppingCart, Upload, MessageSquare, Film,
  BookOpen, Moon, GraduationCap, Leaf, Smile, Globe, Cloud, Waves, Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b w-full">
      <div className="mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-primary font-bold text-2xl">Miy</span>
          <span className="font-bold text-2xl">Tube</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/search" className="text-foreground hover:text-primary transition-colors">Search</Link>
          <Link to="/shorts" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Film size={16} />
            <span>Shorts</span>
          </Link>
          <Link to="/long-videos" className="text-foreground hover:text-primary transition-colors">Long Videos</Link>
          <Link to="/music" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Music size={16} />
            <span>Music</span>
          </Link>
          <Link to="/talk-at-cha" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <MessageSquare size={16} />
            <span>TalkAtCha</span>
          </Link>
          
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
          
          <DropdownMenu>
            <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors">Business</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to="/monetization" className="flex items-center gap-2 w-full">
                  <DollarSign size={16} />
                  <span>Monetization</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/advertising" className="flex items-center gap-2 w-full">
                  <ShoppingCart size={16} />
                  <span>Advertising</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        <div className="flex items-center gap-4">
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
          
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Bell size={20} />
          </button>
          
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
