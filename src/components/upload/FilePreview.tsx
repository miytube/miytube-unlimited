
import React from 'react';
import { AlertCircle, FileIcon, X } from 'lucide-react';

interface FilePreviewProps {
  uploadError: string | null;
  uploadDestination?: string;
  uploadedFiles?: File[];
}

export const FilePreview: React.FC<FilePreviewProps> = ({ uploadError, uploadDestination, uploadedFiles = [] }) => {
  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {uploadError && (
        <div className="flex items-center gap-2 text-destructive text-sm mb-4">
          <AlertCircle size={16} />
          <span>{uploadError}</span>
        </div>
      )}
      
      {uploadedFiles.length > 0 && (
        <div className="mb-4 mt-4">
          <h3 className="text-sm font-medium mb-2">Uploaded Files (Demo Only - Not Stored)</h3>
          <div className="bg-secondary/30 p-3 rounded max-h-48 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 mb-2 bg-background rounded">
                <div className="flex items-center gap-2">
                  <FileIcon size={16} className="text-primary" />
                  <div className="text-sm">
                    <div className="font-medium truncate max-w-xs">{file.name}</div>
                    <div className="text-muted-foreground text-xs">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <div className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
                  Uploaded
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2 bg-yellow-500/10 p-2 rounded border border-yellow-200">
            <span className="font-medium">Note:</span> This is a demonstration only. Files are temporarily stored in browser memory and will be lost when you refresh the page.
          </div>
        </div>
      )}
      
      {uploadDestination && (
        <div className="text-xs text-muted-foreground mb-4 mt-2 bg-secondary/30 p-2 rounded">
          <p>In a real application, files would appear in: <span className="font-medium">{uploadDestination}</span></p>
        </div>
      )}
    </>
  );
};
