
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
      <h3 className="text-sm font-medium mb-2">Selected Files</h3>
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
              <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-semibold">
                READY TO PUBLISH
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 bg-primary/10 border-2 border-primary/30 p-3 rounded-md">
        <p className="text-sm font-bold text-primary mb-1">
          Your file is ready to publish
        </p>
        <p className="text-sm text-foreground">
          Click the blue <span className="font-bold">"Upload Video"</span> button to publish it.
        </p>
      </div>
    </div>
  );
};
