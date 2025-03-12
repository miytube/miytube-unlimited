
import React from 'react';
import { Button } from '@/components/ui/button';
import { VideoCamera, Upload, BarChart } from 'lucide-react';

export const ChannelHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Creator Studio</h1>
      <p className="text-muted-foreground mb-6">
        Create, manage, and grow your channel with MiyTube creator tools
      </p>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Button className="gap-2">
          <VideoCamera size={18} />
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
      </div>
      
      <div className="h-0.5 w-full bg-muted"></div>
    </div>
  );
};
