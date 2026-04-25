import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogIn, LogOut, Shield, Settings } from 'lucide-react';
import { UploadDropdown } from './UploadDropdown';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserActions: React.FC = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <UploadDropdown />
      
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell size={20} />
      </Button>
      
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="User menu">
              <User size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/channel" className="flex items-center gap-2">
                <User size={16} />
                My Channel
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account" className="flex items-center gap-2">
                <Settings size={16} />
                Account Settings
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex items-center gap-2">
                  <Shield size={16} />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut size={16} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" size="sm" asChild>
          <Link to="/auth" className="flex items-center gap-2">
            <LogIn size={16} />
            Sign In
          </Link>
        </Button>
      )}
    </div>
  );
};
