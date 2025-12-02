
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { ShortCard } from '@/components/ShortCard';
import { TrendingShortVideosSection } from '@/components/video/TrendingShortVideosSection';

// Mock data for trending content
const trendingVideos = [
  {
    id: 'trv1',
    title: 'How AI is Changing Content Creation',
    thumbnail: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&w=800&q=80',
    channelName: 'Future Tech',
    views: '2.4M',
    timestamp: '3 days ago',
    duration: '18:42',
  },
  {
    id: 'trv2',
    title: 'Learn React in 30 Minutes',
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80',
    channelName: 'Code Masters',
    views: '1.7M',
    timestamp: '1 week ago',
    duration: '32:15',
  },
  {
    id: 'trv3',
    title: 'The Most Beautiful Places in the World',
    thumbnail: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=800&q=80',
    channelName: 'Travel Diaries',
    views: '3.9M',
    timestamp: '2 weeks ago',
    duration: '24:10',
  },
  {
    id: 'trv4',
    title: 'Healthy Breakfast Ideas for Busy Mornings',
    thumbnail: 'https://images.unsplash.com/photo-1533089860892-a9b385b26c73?auto=format&fit=crop&w=800&q=80',
    channelName: 'Health & Wellness',
    views: '1.3M',
    timestamp: '5 days ago',
    duration: '15:23',
  },
];

const trendingMusic = [
  {
    id: 'trm1',
    title: 'Summer Vibes - Electronic Mix',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    creator: 'ElectroBeats',
    views: '897K',
  },
  {
    id: 'trm2',
    title: 'Acoustic Coffee House Playlist',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    creator: 'Mellow Tunes',
    views: '1.2M',
  },
  {
    id: 'trm3',
    title: 'Hip Hop Workout Mix 2023',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    creator: 'Fitness Beats',
    views: '2.1M',
  },
  {
    id: 'trm4',
    title: 'Indie Rock Anthems',
    thumbnail: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=800&q=80',
    creator: 'Rock Revolution',
    views: '745K',
  },
];

const trendingPodcasts = [
  {
    id: 'trp1',
    title: 'The Future of Technology',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    creator: 'Tech Talks',
    views: '456K',
  },
  {
    id: 'trp2',
    title: 'True Crime Stories: Unsolved Mysteries',
    thumbnail: 'https://images.unsplash.com/photo-1585314062604-1a357de8b000?auto=format&fit=crop&w=800&q=80',
    creator: 'Crime Junkie',
    views: '1.5M',
  },
  {
    id: 'trp3',
    title: 'Mindfulness and Mental Health',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    creator: 'Wellness Warriors',
    views: '892K',
  },
  {
    id: 'trp4',
    title: 'Business Strategies for Growth',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    creator: 'Entrepreneur Edge',
    views: '678K',
  },
];

// We can add more trending categories as needed

interface TrendingCategoryProps {
  title: string;
  linkTo: string;
  children: React.ReactNode;
}

const TrendingCategory: React.FC<TrendingCategoryProps> = ({ title, linkTo, children }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          {title}
        </h2>
        <Link to={linkTo} className="text-primary flex items-center hover:underline">
          See all <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      {children}
    </div>
  );
};

const Trending: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'music' | 'podcasts'>('all');

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / Trending
          </p>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Trending Now
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover what's popular across MiyTube - updated hourly
          </p>

          <div className="flex border-b mt-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'videos' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'music' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('music')}
            >
              Music
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'podcasts' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('podcasts')}
            >
              Podcasts
            </button>
          </div>
        </div>

        {(activeTab === 'all' || activeTab === 'videos') && (
          <TrendingCategory title="Trending Videos" linkTo="/videos/trending">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingVideos.map(video => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </TrendingCategory>
        )}

        {(activeTab === 'all' || activeTab === 'videos') && <TrendingShortVideosSection />}

        {(activeTab === 'all' || activeTab === 'music') && (
          <TrendingCategory title="Trending Music" linkTo="/music">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {trendingMusic.map(item => (
                <ShortCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail}
                  creator={item.creator}
                  views={item.views}
                />
              ))}
            </div>
          </TrendingCategory>
        )}

        {(activeTab === 'all' || activeTab === 'podcasts') && (
          <TrendingCategory title="Trending Podcasts" linkTo="/podcasts">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {trendingPodcasts.map(item => (
                <ShortCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail}
                  creator={item.creator}
                  views={item.views}
                />
              ))}
            </div>
          </TrendingCategory>
        )}
      </div>
    </Layout>
  );
};

export default Trending;
