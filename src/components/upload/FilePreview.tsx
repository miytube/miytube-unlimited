
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UploadError } from './UploadError';
import { VideoPreviewPlayer } from './VideoPreviewPlayer';
import { UploadedFilesList } from './UploadedFilesList';

interface FilePreviewProps {
  uploadError: string | null;
  uploadDestination?: string;
  uploadedFiles?: File[];
}

export const FilePreview: React.FC<FilePreviewProps> = ({ 
  uploadError, 
  uploadDestination, 
  uploadedFiles = [] 
}) => {
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/');
  };

  const handlePlayVideo = (file: File) => {
    if (isVideoFile(file)) {
      setSelectedVideoFile(file);
    } else {
      toast({
        title: "Cannot play this file",
        description: "This file is not a video file.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <UploadError error={uploadError} />
      
      <VideoPreviewPlayer 
        selectedVideoFile={selectedVideoFile} 
        onClose={() => setSelectedVideoFile(null)} 
      />
      
      <UploadedFilesList 
        uploadedFiles={uploadedFiles}
        formatFileSize={formatFileSize}
        isVideoFile={isVideoFile}
        onPlayVideo={handlePlayVideo}
      />
      
      {uploadDestination && (
        <div className="text-xs text-muted-foreground mb-4 mt-2 bg-secondary/30 p-2 rounded">
          <p>In a real application, files would appear in: <span className="font-medium">{uploadDestination}</span></p>
        </div>
      )}
    </>
  );
};
