
import React from 'react';
import { Info } from 'lucide-react';

interface UploadRequirementsProps {
  videoFormats: string[];
  audioFormats: string[];
}

export const UploadRequirements: React.FC<UploadRequirementsProps> = ({ 
  videoFormats, 
  audioFormats 
}) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Info size={20} className="text-primary" />
        <h2 className="text-xl font-semibold">Upload Requirements</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Video Formats</h3>
          <p className="text-sm text-muted-foreground">
            {videoFormats.join(', ')}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Audio Formats</h3>
          <p className="text-sm text-muted-foreground">
            {audioFormats.join(', ')}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Resolution</h3>
          <p className="text-sm text-muted-foreground">
            Up to 8K (7680 × 4320) resolution
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">File Size</h3>
          <p className="text-sm text-muted-foreground">
            Up to 128GB per video file
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Frame Rate</h3>
          <p className="text-sm text-muted-foreground">
            Up to 60 frames per second
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">No Time Limits</h3>
          <p className="text-sm text-muted-foreground">
            No expiration dates or time restrictions
          </p>
        </div>
      </div>
    </div>
  );
};
