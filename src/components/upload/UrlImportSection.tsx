import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link2, CheckCircle, AlertCircle, Loader2, Youtube } from 'lucide-react';

interface UrlImportSectionProps {
  onUrlImport: (url: string, isYouTube?: boolean, youtubeId?: string) => void;
  disabled?: boolean;
}

// Extract YouTube video ID from various YouTube URL formats
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

export const UrlImportSection: React.FC<UrlImportSectionProps> = ({
  onUrlImport,
  disabled = false
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [urlStatus, setUrlStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid' | 'youtube'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [youtubeId, setYoutubeId] = useState<string | null>(null);

  const validateUrl = (url: string): { valid: boolean; isYouTube: boolean; youtubeId: string | null } => {
    try {
      const parsedUrl = new URL(url);
      
      // Check for YouTube URLs first
      const ytId = extractYouTubeId(url);
      if (ytId) {
        return { valid: true, isYouTube: true, youtubeId: ytId };
      }
      
      // Check for direct video file URLs
      const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.m4v'];
      const isDirectVideo = videoExtensions.some(ext => parsedUrl.pathname.toLowerCase().endsWith(ext));
      const isVideoHost = ['drive.google.com', 'dropbox.com', 'supabase.co'].some(
        host => parsedUrl.hostname.includes(host)
      );
      
      return { 
        valid: isDirectVideo || isVideoHost || parsedUrl.protocol === 'https:', 
        isYouTube: false, 
        youtubeId: null 
      };
    } catch {
      return { valid: false, isYouTube: false, youtubeId: null };
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    
    if (!url.trim()) {
      setUrlStatus('idle');
      setErrorMessage('');
      setYoutubeId(null);
      return;
    }
    
    setUrlStatus('validating');
    
    // Debounce validation
    setTimeout(() => {
      const result = validateUrl(url);
      if (result.valid) {
        if (result.isYouTube) {
          setUrlStatus('youtube');
          setYoutubeId(result.youtubeId);
        } else {
          setUrlStatus('valid');
          setYoutubeId(null);
        }
        setErrorMessage('');
      } else {
        setUrlStatus('invalid');
        setYoutubeId(null);
        setErrorMessage('Please enter a valid video URL');
      }
    }, 300);
  };

  const handleImport = () => {
    if ((urlStatus === 'valid' || urlStatus === 'youtube') && videoUrl.trim()) {
      onUrlImport(videoUrl.trim(), urlStatus === 'youtube', youtubeId || undefined);
      setVideoUrl('');
      setUrlStatus('idle');
      setYoutubeId(null);
    }
  };

  return (
    <div className="border-t border-border pt-6 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium text-foreground">Or import from URL</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Paste a YouTube link or direct video URL from cloud storage
      </p>
      
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            type="url"
            placeholder="https://youtube.com/watch?v=... or direct video URL"
            value={videoUrl}
            onChange={handleUrlChange}
            disabled={disabled}
            className={`pr-10 ${urlStatus === 'invalid' ? 'border-destructive' : (urlStatus === 'valid' || urlStatus === 'youtube') ? 'border-green-500' : ''}`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {urlStatus === 'validating' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {urlStatus === 'valid' && <CheckCircle className="h-4 w-4 text-green-500" />}
            {urlStatus === 'youtube' && <Youtube className="h-4 w-4 text-red-500" />}
            {urlStatus === 'invalid' && <AlertCircle className="h-4 w-4 text-destructive" />}
          </div>
        </div>
        <Button 
          onClick={handleImport}
          disabled={disabled || (urlStatus !== 'valid' && urlStatus !== 'youtube')}
          variant="secondary"
        >
          Import
        </Button>
      </div>
      
      {errorMessage && (
        <p className="text-sm text-destructive mt-2">{errorMessage}</p>
      )}
      
      {urlStatus === 'youtube' && youtubeId && (
        <div className="mt-3 p-3 bg-muted rounded-lg flex items-center gap-3">
          <Youtube className="h-5 w-5 text-red-500" />
          <div>
            <p className="text-sm font-medium text-foreground">YouTube Video Detected</p>
            <p className="text-xs text-muted-foreground">Video ID: {youtubeId}</p>
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-3">
        Supports: YouTube links, Google Drive, Dropbox, and direct video file URLs
      </p>
    </div>
  );
};
