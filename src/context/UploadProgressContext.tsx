import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UploadProgress {
  isUploading: boolean;
  fileName: string;
  fileSizeMB: number;
  estimatedMinutes: number;
  startTime: number;
  progress: number; // 0-100, estimated based on time
}

interface UploadProgressContextType {
  uploadProgress: UploadProgress | null;
  startUpload: (fileName: string, fileSizeMB: number, estimatedMinutes: number) => void;
  completeUpload: () => void;
  failUpload: (error: string) => void;
}

const UploadProgressContext = createContext<UploadProgressContextType | undefined>(undefined);

export const useUploadProgress = () => {
  const context = useContext(UploadProgressContext);
  if (!context) {
    throw new Error('useUploadProgress must be used within an UploadProgressProvider');
  }
  return context;
};

export const UploadProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const startUpload = (fileName: string, fileSizeMB: number, estimatedMinutes: number) => {
    setUploadProgress({
      isUploading: true,
      fileName,
      fileSizeMB,
      estimatedMinutes,
      startTime: Date.now(),
      progress: 0,
    });
  };

  const completeUpload = () => {
    setUploadProgress(null);
  };

  const failUpload = (error: string) => {
    console.error('Upload failed:', error);
    setUploadProgress(null);
  };

  return (
    <UploadProgressContext.Provider
      value={{
        uploadProgress,
        startUpload,
        completeUpload,
        failUpload,
      }}
    >
      {children}
    </UploadProgressContext.Provider>
  );
};
