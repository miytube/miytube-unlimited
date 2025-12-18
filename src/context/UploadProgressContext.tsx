import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UploadStatus = 'idle' | 'processing' | 'uploading' | 'complete' | 'failed';

export interface UploadProgress {
  isUploading: boolean;
  status: UploadStatus;
  fileName: string;
  fileSizeMB: number;
  estimatedMinutes: number;
  startTime: number;
  progress: number; // 0-100, estimated based on time
  cloudBackupComplete: boolean;
  errorMessage?: string;
}

interface UploadProgressContextType {
  uploadProgress: UploadProgress | null;
  startUpload: (fileName: string, fileSizeMB: number, estimatedMinutes: number) => void;
  setUploadStatus: (status: UploadStatus) => void;
  completeUpload: () => void;
  failUpload: (error: string) => void;
  isUploadInProgress: () => boolean;
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
      status: 'uploading',
      fileName,
      fileSizeMB,
      estimatedMinutes,
      startTime: Date.now(),
      progress: 0,
      cloudBackupComplete: false,
    });
  };

  const setUploadStatus = (status: UploadStatus) => {
    setUploadProgress(prev => prev ? { ...prev, status } : null);
  };

  const completeUpload = () => {
    // Show completion status briefly before clearing
    setUploadProgress(prev => prev ? {
      ...prev,
      isUploading: false,
      status: 'complete',
      cloudBackupComplete: true,
      progress: 100,
    } : null);
    
    // Clear after showing completion
    setTimeout(() => {
      setUploadProgress(null);
    }, 3000);
  };

  const failUpload = (error: string) => {
    console.error('Upload failed:', error);
    setUploadProgress(prev => prev ? {
      ...prev,
      isUploading: false,
      status: 'failed',
      cloudBackupComplete: false,
      errorMessage: error,
    } : null);
    
    // Clear after showing error
    setTimeout(() => {
      setUploadProgress(null);
    }, 5000);
  };

  const isUploadInProgress = () => {
    return uploadProgress?.isUploading === true && uploadProgress?.status === 'uploading';
  };

  return (
    <UploadProgressContext.Provider
      value={{
        uploadProgress,
        startUpload,
        setUploadStatus,
        completeUpload,
        failUpload,
        isUploadInProgress,
      }}
    >
      {children}
    </UploadProgressContext.Provider>
  );
};
