
import React from 'react';
import { FileIcon, Play } from 'lucide-react';

interface UploadedFilesListProps {
  uploadedFiles: File[];
  formatFileSize: (bytes: number) => string;
  isVideoFile: (file: File) => boolean;
  onPlayVideo: (file: File) => void;
}

export const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
  uploadedFiles,
  formatFileSize,
  isVideoFile,
  onPlayVideo,
}) => {
  if (uploadedFiles.length === 0) return null;

  return (
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
            <div className="flex gap-2">
              {isVideoFile(file) && (
                <button 
                  onClick={() => onPlayVideo(file)}
                  className="text-xs bg-primary text-white px-2 py-1 rounded flex items-center gap-1"
                >
                  <Play size={12} /> Play
                </button>
              )}
              <div className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
                Uploaded
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground mt-2 bg-yellow-500/10 p-2 rounded border border-yellow-200">
        <span className="font-medium">Note:</span> This is a demonstration only. Files are temporarily stored in browser memory and will be lost when you refresh the page.
      </div>
    </div>
  );
};
