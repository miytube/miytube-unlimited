
// Mock video data for the Home page
export interface MockVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  timestamp: string;
  duration: string;
  tags?: string[];
}

// Empty array - no placeholder videos
export const mockVideos: MockVideo[] = [];
