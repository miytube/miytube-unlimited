
import React from 'react';
import { Link } from 'react-router-dom';

export const SidebarFooter: React.FC = () => {
  return (
    <div className="border-t mt-6 pt-4 text-xs text-muted-foreground">
      <div className="flex flex-wrap gap-x-2 px-3 mb-4">
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/copyright" className="hover:underline">Copyright</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/privacy" className="hover:underline">Privacy</Link>
      </div>
      <p className="px-3">© 2023 MiyTube</p>
    </div>
  );
};
