import React from 'react';
import { useUploadProgress } from '@/context/UploadProgressContext';
import { Loader2, Upload, Cloud, CheckCircle2 } from 'lucide-react';

interface UploadActionsProps {
  uploading: boolean;
  isValid: boolean;
  onUpload: () => void;
}

export const UploadActions: React.FC<UploadActionsProps> = ({ 
  uploading, 
  isValid,
  onUpload 
}) => {
  const { uploadProgress, isUploadInProgress } = useUploadProgress();
  
  const cloudUploadInProgress = isUploadInProgress();
  const isDisabled = uploading || !isValid || cloudUploadInProgress;
  
  const getButtonContent = () => {
    if (cloudUploadInProgress) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cloud Backup in Progress...</span>
        </>
      );
    }
    
    if (uploading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      );
    }
    
    if (uploadProgress?.status === 'complete') {
      return (
        <>
          <CheckCircle2 className="h-4 w-4" />
          <span>Upload Complete!</span>
        </>
      );
    }
    
    return (
      <>
        <Upload className="h-4 w-4" />
        <span>Upload Video</span>
      </>
    );
  };

  return (
    <div className="mt-6 space-y-3">
      <button
        type="button"
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md transition-colors text-lg font-medium ${
          isDisabled 
            ? 'bg-primary/50 cursor-not-allowed' 
            : 'bg-primary hover:bg-primary/90'
        } text-primary-foreground`}
        disabled={isDisabled}
        onClick={onUpload}
      >
        {getButtonContent()}
      </button>
      
      {cloudUploadInProgress && (
        <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-500/10 p-2 rounded-md">
          <Cloud className="h-4 w-4" />
          <span>Please wait for cloud backup to complete before uploading another video</span>
        </div>
      )}
    </div>
  );
};
