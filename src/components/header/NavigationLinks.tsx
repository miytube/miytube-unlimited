
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Music, MessageSquare, GraduationCap, Microscope } from 'lucide-react';
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
      <Link to="/education" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
        <GraduationCap size={16} />
        <span>Education</span>
      </Link>
      <Link to="/film" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
        <Film size={16} />
        <span>Film</span>
      </Link>
      <Link to="/science-tech" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
        <Microscope size={16} />
        <span>Science & Tech</span>
      </Link>
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
