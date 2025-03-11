
import React from 'react';
import { Info } from 'lucide-react';

interface UploadRequirementsProps {
  audioFormats: string[];
}

export const MusicUploadRequirements: React.FC<UploadRequirementsProps> = ({ 
  audioFormats 
}) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Info size={20} className="text-primary" />
        <h2 className="text-xl font-semibold">Music Upload Requirements</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Audio Formats Only</h3>
          <p className="text-sm text-muted-foreground">
            {audioFormats.join(', ')}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">File Size</h3>
          <p className="text-sm text-muted-foreground">
            Up to 10GB per audio file
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Quality</h3>
          <p className="text-sm text-muted-foreground">
            High-quality audio (128kbps minimum)
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Copyright</h3>
          <p className="text-sm text-muted-foreground">
            You must own rights or have permission
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Videos Not Allowed</h3>
          <p className="text-sm text-muted-foreground">
            This section is for audio files only
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Metadata</h3>
          <p className="text-sm text-muted-foreground">
            Include title, artist, and genre information
          </p>
        </div>
      </div>
    </div>
  );
};
