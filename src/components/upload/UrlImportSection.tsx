import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UrlImportSectionProps {
  onUrlImport: (url: string) => void;
  disabled?: boolean;
}

export const UrlImportSection: React.FC<UrlImportSectionProps> = ({
  onUrlImport,
  disabled = false
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [urlStatus, setUrlStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      // Check for common video file extensions or video hosting patterns
      const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.m4v'];
      const isDirectVideo = videoExtensions.some(ext => parsedUrl.pathname.toLowerCase().endsWith(ext));
      const isVideoHost = ['youtube.com', 'vimeo.com', 'dailymotion.com', 'drive.google.com', 'dropbox.com', 'supabase.co'].some(
        host => parsedUrl.hostname.includes(host)
      );
      return isDirectVideo || isVideoHost || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    
    if (!url.trim()) {
      setUrlStatus('idle');
      setErrorMessage('');
      return;
    }
    
    setUrlStatus('validating');
    
    // Debounce validation
    setTimeout(() => {
      if (validateUrl(url)) {
        setUrlStatus('valid');
        setErrorMessage('');
      } else {
        setUrlStatus('invalid');
        setErrorMessage('Please enter a valid video URL');
      }
    }, 300);
  };

  const handleImport = () => {
    if (urlStatus === 'valid' && videoUrl.trim()) {
      onUrlImport(videoUrl.trim());
      setVideoUrl('');
      setUrlStatus('idle');
    }
  };

  return (
    <div className="border-t border-border pt-6 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium text-foreground">Or import from URL</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Paste a direct link to a video file hosted on cloud storage (Google Drive, Dropbox, etc.)
      </p>
      
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            type="url"
            placeholder="https://example.com/video.mp4"
            value={videoUrl}
            onChange={handleUrlChange}
            disabled={disabled}
            className={`pr-10 ${urlStatus === 'invalid' ? 'border-destructive' : urlStatus === 'valid' ? 'border-green-500' : ''}`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {urlStatus === 'validating' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {urlStatus === 'valid' && <CheckCircle className="h-4 w-4 text-green-500" />}
            {urlStatus === 'invalid' && <AlertCircle className="h-4 w-4 text-destructive" />}
          </div>
        </div>
        <Button 
          onClick={handleImport}
          disabled={disabled || urlStatus !== 'valid'}
          variant="secondary"
        >
          Import
        </Button>
      </div>
      
      {errorMessage && (
        <p className="text-sm text-destructive mt-2">{errorMessage}</p>
      )}
      
      <p className="text-xs text-muted-foreground mt-3">
        Tip: For large files, use a direct download link from your cloud storage for faster imports.
      </p>
    </div>
  );
};
