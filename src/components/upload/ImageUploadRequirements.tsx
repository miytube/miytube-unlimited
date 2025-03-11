
import React from 'react';
import { Info } from 'lucide-react';

interface ImageUploadRequirementsProps {
  imageFormats: string[];
}

export const ImageUploadRequirements: React.FC<ImageUploadRequirementsProps> = ({ 
  imageFormats 
}) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Info size={20} className="text-primary" />
        <h2 className="text-xl font-semibold">Image Upload Requirements</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Image Formats Only</h3>
          <p className="text-sm text-muted-foreground">
            {imageFormats.join(', ')}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">File Size</h3>
          <p className="text-sm text-muted-foreground">
            Up to 50MB per image file
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Dimensions</h3>
          <p className="text-sm text-muted-foreground">
            Minimum 1200x1200 pixels recommended
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Copyright</h3>
          <p className="text-sm text-muted-foreground">
            You must own rights or have permission
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">High Quality</h3>
          <p className="text-sm text-muted-foreground">
            Clear, sharp images with good lighting
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Metadata</h3>
          <p className="text-sm text-muted-foreground">
            Include title, description and category
          </p>
        </div>
      </div>
    </div>
  );
};
