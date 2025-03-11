
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FilePreviewProps {
  uploadError: string | null;
  uploadDestination?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ uploadError, uploadDestination }) => {
  if (!uploadError && !uploadDestination) return null;

  return (
    <>
      {uploadError && (
        <div className="flex items-center gap-2 text-destructive text-sm mb-4">
          <AlertCircle size={16} />
          <span>{uploadError}</span>
        </div>
      )}
      
      {uploadDestination && (
        <div className="text-xs text-muted-foreground mb-4 mt-2 bg-secondary/30 p-2 rounded">
          <p>Your uploaded files will appear in: <span className="font-medium">{uploadDestination}</span></p>
        </div>
      )}
    </>
  );
};
