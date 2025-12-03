
export const featuredLongVideos: Array<{
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  timestamp: string;
  duration: string;
  tags?: string[];
}> = [];

// Define supported video and audio formats
export const supportedVideoFormats = ['3gp', '3gpp', 'asf', 'avi', 'dat', 'flv', 'mov', 'mpg', 'mpeg', 'mp4', 'mkv', 'm4v', 'rm', 'wmv'];
export const supportedAudioFormats = ['flac', 'm4a', 'mp3', 'mp4', 'ogg', 'rm', 'vqf', 'wav', 'wma'];

export const videoCategories = [
  { name: 'Educational Courses', icon: '🎓' },
  { name: 'Documentaries', icon: '🎬' },
  { name: 'Podcasts', icon: '🎙️' },
  { name: 'Concerts', icon: '🎵' },
  { name: 'Gaming Sessions', icon: '🎮' },
  { name: 'Lectures', icon: '📚' },
  { name: 'Conferences', icon: '👥' },
  { name: 'Audiobooks', icon: '📖' }
];
