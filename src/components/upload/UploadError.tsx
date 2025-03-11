
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface UploadErrorProps {
  error: string | null;
}

export const UploadError: React.FC<UploadErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="flex items-center gap-2 text-destructive text-sm mb-4">
      <AlertCircle size={16} />
      <span>{error}</span>
    </div>
  );
};
