/**
 * Video compatibility checker for browser playback
 * Detects unsupported codecs/containers before upload
 */

export interface VideoCompatibilityResult {
  isCompatible: boolean;
  canPlay: boolean;
  errorMessage?: string;
  details: {
    container: string;
    mimeType: string;
    duration?: number;
    width?: number;
    height?: number;
    videoCodec?: string;
    audioCodec?: string;
  };
}

// MIME types that browsers generally support
const SUPPORTED_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime', // May work in Safari
];

// File extensions mapped to expected MIME types
const EXTENSION_MIME_MAP: Record<string, string[]> = {
  '.mp4': ['video/mp4'],
  '.m4v': ['video/mp4', 'video/x-m4v'],
  '.webm': ['video/webm'],
  '.ogv': ['video/ogg'],
  '.ogg': ['video/ogg'],
  '.mov': ['video/quicktime'],
  '.avi': ['video/x-msvideo'],
  '.wmv': ['video/x-ms-wmv'],
  '.mkv': ['video/x-matroska'],
  '.flv': ['video/x-flv'],
  '.3gp': ['video/3gpp'],
};

// Known problematic formats
const UNSUPPORTED_FORMATS: Record<string, string> = {
  'video/x-msvideo': 'AVI files are not supported. Please convert to MP4 (H.264).',
  'video/x-ms-wmv': 'WMV files are not supported. Please convert to MP4 (H.264).',
  'video/x-matroska': 'MKV files may not play in all browsers. Please convert to MP4 (H.264).',
  'video/x-flv': 'FLV files are not supported. Please convert to MP4 (H.264).',
  'video/mpeg': 'MPEG files may not play. Please convert to MP4 (H.264).',
};

/**
 * Get file extension from filename
 */
const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.slice(lastDot).toLowerCase() : '';
};

/**
 * Check if browser can play this MIME type
 */
const canBrowserPlayType = (mimeType: string): CanPlayTypeResult => {
  const video = document.createElement('video');
  return video.canPlayType(mimeType);
};

/**
 * Validate video file compatibility with browser playback
 */
export const checkVideoCompatibility = (file: File): Promise<VideoCompatibilityResult> => {
  return new Promise((resolve) => {
    const extension = getFileExtension(file.name);
    const mimeType = file.type || EXTENSION_MIME_MAP[extension]?.[0] || 'unknown';
    
    const result: VideoCompatibilityResult = {
      isCompatible: false,
      canPlay: false,
      details: {
        container: extension.replace('.', '').toUpperCase() || 'Unknown',
        mimeType,
      },
    };

    // Check for known unsupported formats first
    if (UNSUPPORTED_FORMATS[mimeType]) {
      result.errorMessage = UNSUPPORTED_FORMATS[mimeType];
      resolve(result);
      return;
    }

    // Check browser's canPlayType
    const canPlayResult = canBrowserPlayType(mimeType);
    if (canPlayResult === '') {
      // Browser definitely can't play this
      result.errorMessage = `Your browser cannot play ${result.details.container} files (${mimeType}). Please convert to MP4 with H.264 video codec and AAC audio codec.`;
      resolve(result);
      return;
    }

    // Try to actually load AND DECODE the video to verify codec compatibility
    // Just loading metadata isn't enough - we need to decode actual frames
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    let hasResolved = false;
    
    // Set a timeout for slow files
    const timeout = setTimeout(() => {
      if (hasResolved) return;
      hasResolved = true;
      cleanup();
      // If we timeout, be cautious and warn the user
      result.errorMessage = 'Could not verify video compatibility within time limit. The file may not play correctly. Consider converting to MP4 (H.264/AAC).';
      resolve(result);
    }, 15000);

    const cleanup = () => {
      clearTimeout(timeout);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('error', onError);
      video.pause();
      video.src = '';
      URL.revokeObjectURL(url);
    };

    const onLoadedMetadata = () => {
      result.details.duration = video.duration;
      result.details.width = video.videoWidth;
      result.details.height = video.videoHeight;
      
      // After metadata loads, try to actually play a bit to force decode
      video.currentTime = 0;
      video.muted = true;
      video.play().catch(() => {
        // Play failed, but error handler will catch the reason
      });
    };

    const onCanPlayThrough = () => {
      // canplaythrough means browser thinks it can play without buffering
      // But we still need to verify actual decoding works
    };

    const onPlaying = () => {
      // Video is actually playing - codec decoding works!
      if (hasResolved) return;
      hasResolved = true;
      cleanup();
      result.isCompatible = true;
      result.canPlay = true;
      resolve(result);
    };

    const onError = () => {
      if (hasResolved) return;
      hasResolved = true;
      cleanup();
      const error = video.error;
      
      switch (error?.code) {
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          result.errorMessage = `This video format is not supported by your browser. The file may use an incompatible codec (like HEVC/H.265). Please re-encode as MP4 with H.264 video and AAC audio.`;
          break;
        case MediaError.MEDIA_ERR_DECODE:
          result.errorMessage = `Cannot decode this video. The codec is not supported. Please convert to MP4 (H.264/AAC).`;
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          // Network errors during local file check are unusual, treat as potentially compatible
          result.isCompatible = true;
          result.canPlay = true;
          break;
        default:
          result.errorMessage = `Video validation failed. This file may not play correctly. Consider converting to MP4 (H.264/AAC).`;
      }
      
      resolve(result);
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('canplaythrough', onCanPlayThrough);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('error', onError);
    
    video.preload = 'auto';
    video.src = url;
    video.load();
  });
};

/**
 * Quick check if file extension is potentially supported
 */
export const isVideoExtensionSupported = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  const supportedExtensions = ['.mp4', '.m4v', '.webm', '.ogv', '.ogg', '.mov'];
  return supportedExtensions.includes(ext);
};

/**
 * Get user-friendly format recommendation
 */
export const getFormatRecommendation = (): string => {
  return 'For best compatibility, use MP4 files encoded with H.264 video codec and AAC audio codec. Most video editors and converters support this format. Free tools like HandBrake can convert videos to this format.';
};
