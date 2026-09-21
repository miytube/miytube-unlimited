
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, MessageSquare, Megaphone, Users, Armchair } from 'lucide-react';
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
      <Link to="/talk-at-cha" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
        <MessageSquare size={16} />
        <span>MiyTube At Cha</span>
      </Link>
      
      <ContentDropdown />
      <BusinessDropdown />

      <Link to="/the-room" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
        <Armchair size={16} />
        <span>The Room</span>
      </Link>

      <Link
        to="/monetization"
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <Users size={16} />
        <span>Creators</span>
      </Link>

      <Link
        to="/advertising"
        className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90"
      >
        <Megaphone size={16} />
        <span>Advertise</span>
      </Link>
    </nav>
  );
};
