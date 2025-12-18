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

    // Try to actually load and play a snippet to verify codec compatibility
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    // Set a timeout for slow files
    const timeout = setTimeout(() => {
      cleanup();
      // If we timeout but canPlayType said maybe/probably, allow it
      if (canPlayResult === 'probably' || canPlayResult === 'maybe') {
        result.isCompatible = true;
        result.canPlay = true;
        resolve(result);
      } else {
        result.errorMessage = 'Could not verify video compatibility. The file may not play correctly.';
        resolve(result);
      }
    }, 10000);

    const cleanup = () => {
      clearTimeout(timeout);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onError);
      URL.revokeObjectURL(url);
    };

    const onLoadedMetadata = () => {
      result.details.duration = video.duration;
      result.details.width = video.videoWidth;
      result.details.height = video.videoHeight;
    };

    const onCanPlay = () => {
      cleanup();
      result.isCompatible = true;
      result.canPlay = true;
      resolve(result);
    };

    const onError = () => {
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
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('error', onError);
    
    video.preload = 'metadata';
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
