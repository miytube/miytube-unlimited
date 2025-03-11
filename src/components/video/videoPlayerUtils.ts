
/**
 * Formats time in seconds to a MM:SS format
 */
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * Generates a video source URL
 */
export const getVideoSource = (videoId: string, format: string = 'mp4'): string => {
  return `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.${format}`;
};
