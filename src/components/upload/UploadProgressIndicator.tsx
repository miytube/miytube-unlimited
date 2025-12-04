import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useUploadProgress } from '@/context/UploadProgressContext';
import { Upload, Clock, HardDrive } from 'lucide-react';

export const UploadProgressIndicator: React.FC = () => {
  const { uploadProgress } = useUploadProgress();
  const [estimatedProgress, setEstimatedProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!uploadProgress?.isUploading) {
      setEstimatedProgress(0);
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - uploadProgress.startTime) / 1000; // seconds
      setElapsedTime(elapsed);
      
      // Estimate progress based on elapsed time vs estimated time
      // Use a logarithmic curve so it never quite reaches 100% until complete
      const estimatedSeconds = uploadProgress.estimatedMinutes * 60;
      const rawProgress = (elapsed / estimatedSeconds) * 100;
      const smoothedProgress = Math.min(95, rawProgress * 0.9 + Math.log10(rawProgress + 1) * 10);
      setEstimatedProgress(Math.max(0, smoothedProgress));
    }, 500);

    return () => clearInterval(interval);
  }, [uploadProgress]);

  if (!uploadProgress?.isUploading) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const remainingTime = Math.max(0, (uploadProgress.estimatedMinutes * 60) - elapsedTime);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-card border border-border rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Upload className="h-5 w-5 text-primary animate-pulse" />
        <span className="font-semibold text-foreground">Uploading Large Video</span>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground truncate">
          {uploadProgress.fileName}
        </div>
        
        <Progress value={estimatedProgress} className="h-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            <span>{uploadProgress.fileSizeMB} MB</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>~{formatTime(remainingTime)} remaining</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Elapsed: {formatTime(elapsedTime)} | Est. total: ~{uploadProgress.estimatedMinutes} min
        </div>
        
        <p className="text-xs text-amber-500">
          Please keep this page open until upload completes.
        </p>
      </div>
    </div>
  );
};
