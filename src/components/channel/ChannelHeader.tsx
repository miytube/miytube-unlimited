import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, Upload, BarChart } from 'lucide-react';
import { TipCreatorButton } from '@/components/tips/TipCreatorButton';
import { useAuth } from '@/hooks/useAuth';

interface ChannelHeaderProps {
  creatorId?: string;
}

export const ChannelHeader: React.FC<ChannelHeaderProps> = ({ creatorId }) => {
  const { user } = useAuth();
  const isOwnChannel = !!(user && creatorId && user.id === creatorId);
  return (
    <div className="mb-8">
      <p className="text-sm text-muted-foreground mb-2">
        <span className="font-semibold text-primary">MiyTube</span> / Creator Studio
      </p>
      <h1 className="text-3xl font-bold mb-2">Creator Studio</h1>
      <p className="text-muted-foreground mb-6">
        Create, manage, and grow your channel with MiyTube creator tools
      </p>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Button className="gap-2">
          <Video size={18} />
          Create Content
        </Button>
        <Button variant="outline" className="gap-2">
          <Upload size={18} />
          Upload
        </Button>
        <Button variant="outline" className="gap-2">
          <BarChart size={18} />
          Analytics
        </Button>
        {creatorId && (
          <TipCreatorButton
            creatorId={creatorId}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-secondary transition-colors text-sm font-medium"
          />
        )}
      </div>
      
      <div className="h-0.5 w-full bg-muted"></div>
    </div>
  );
};
