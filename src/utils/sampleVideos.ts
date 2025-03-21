
import { MockVideo } from '@/data/mockVideos';

export const generateSampleVideos = (categoryKey: string, pageTitle: string): MockVideo[] => {
  return [
    {
      id: `${categoryKey}-1`,
      title: `Popular ${pageTitle} Content`,
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      channelName: 'Content Creator',
      views: '1.2M',
      timestamp: '3 days ago',
      duration: '14:35',
    },
    {
      id: `${categoryKey}-2`,
      title: `Trending in ${pageTitle}`,
      thumbnail: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80',
      channelName: 'Trending Channel',
      views: '856K',
      timestamp: '1 week ago',
      duration: '22:15',
    },
    {
      id: `${categoryKey}-3`,
      title: `Best of ${pageTitle} 2023`,
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      channelName: 'Top Picks',
      views: '2.3M',
      timestamp: '2 months ago',
      duration: '18:42',
    },
    {
      id: `${categoryKey}-4`,
      title: `${pageTitle} Highlights`,
      thumbnail: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80',
      channelName: 'Featured Channel',
      views: '4.5M',
      timestamp: '5 months ago',
      duration: '12:18',
    },
  ];
};
