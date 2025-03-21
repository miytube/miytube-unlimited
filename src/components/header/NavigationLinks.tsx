
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Music, MessageSquare } from 'lucide-react';
import { ContentDropdown } from './ContentDropdown';
import { BusinessDropdown } from './BusinessDropdown';

export const NavigationLinks: React.FC = () => {
  return (
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
      
      <ContentDropdown />
      <BusinessDropdown />
    </nav>
  );
};
