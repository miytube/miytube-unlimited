
import React from 'react';
import { Bell, User } from 'lucide-react';
import { UploadDropdown } from './UploadDropdown';

export const UserActions: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <UploadDropdown />
      
      <button className="p-2 rounded-full hover:bg-secondary transition-colors">
        <Bell size={20} />
      </button>
      
      <button className="p-2 rounded-full hover:bg-secondary transition-colors">
        <User size={20} />
      </button>
    </div>
  );
};
