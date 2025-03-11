
import React from 'react';

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
  return (
    <div className="mt-6 text-center">
      <button
        type="button"
        className={`px-6 py-2 ${uploading ? 'bg-primary/50' : 'bg-primary'} text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-lg font-medium`}
        disabled={uploading || !isValid}
        onClick={onUpload}
      >
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
};
