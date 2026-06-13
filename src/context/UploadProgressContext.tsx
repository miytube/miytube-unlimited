import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type UploadStatus = 'idle' | 'processing' | 'uploading' | 'publishing' | 'complete' | 'failed';

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
  dismissUpload: () => void;
  isUploadInProgress: () => boolean;
}

type UploadProgressGlobalContext = typeof globalThis & {
  __miytubeUploadProgressContext__?: React.Context<UploadProgressContextType | undefined>;
};

const UploadProgressContext =
  ((globalThis as UploadProgressGlobalContext).__miytubeUploadProgressContext__ ??=
    createContext<UploadProgressContextType | undefined>(undefined));

export const useUploadProgress = () => {
  const context = useContext(UploadProgressContext);
  if (!context) {
    throw new Error('useUploadProgress must be used within an UploadProgressProvider');
  }
  return context;
};

export const UploadProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  useEffect(() => {
    if (!uploadProgress?.isUploading || !['processing', 'uploading', 'publishing'].includes(uploadProgress.status)) {
      return;
    }

    const estimatedSeconds = Math.max(60, uploadProgress.estimatedMinutes * 60);
    const maxUploadSeconds = Math.max(estimatedSeconds * 3, 600);
    const elapsedSeconds = (Date.now() - uploadProgress.startTime) / 1000;
    const remainingMs = Math.max(0, (maxUploadSeconds - elapsedSeconds) * 1000);

    const timeout = window.setTimeout(() => {
      setUploadProgress(prev => {
        if (!prev?.isUploading || !['processing', 'uploading', 'publishing'].includes(prev.status)) {
          return prev;
        }
        console.error('Upload failed:', 'Upload appears to be stuck. Please try again.');
        return {
          ...prev,
          isUploading: false,
          status: 'failed',
          cloudBackupComplete: false,
          errorMessage: 'Upload appears to be stuck. Please try again.',
        };
      });
    }, remainingMs);

    return () => window.clearTimeout(timeout);
  }, [uploadProgress]);

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

  const dismissUpload = () => {
    setUploadProgress(null);
  };

  const isUploadInProgress = () => {
    return uploadProgress?.isUploading === true && ['processing', 'uploading', 'publishing'].includes(uploadProgress.status);
  };

  return (
    <UploadProgressContext.Provider
      value={{
        uploadProgress,
        startUpload,
        setUploadStatus,
        completeUpload,
        failUpload,
        dismissUpload,
        isUploadInProgress,
      }}
    >
      {children}
    </UploadProgressContext.Provider>
  );
};
