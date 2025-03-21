
import React from 'react';
import { Bell, User } from 'lucide-react';
import { UploadDropdown } from './UploadDropdown';
import { Button } from '@/components/ui/button';

export const UserActions: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <UploadDropdown />
      
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell size={20} />
      </Button>
      
      <Button variant="ghost" size="icon" aria-label="User profile">
        <User size={20} />
      </Button>
    </div>
  );
};
