
import React from 'react';
import { Layout } from '@/components/Layout';
import { Upload, Clock, Film, Info } from 'lucide-react';

const LongVideos = () => {
  const featuredLongVideos = [
    {
      id: 'longvid1',
      title: 'Complete Web Development Course 2023',
      thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      channelName: 'Code Masters',
      views: '2.4M',
      timestamp: '3 months ago',
      duration: '8:25:16',
    },
    {
      id: 'longvid2',
      title: 'Full Concert Live at Madison Square Garden',
      thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
      channelName: 'Music Festival',
      views: '1.8M',
      timestamp: '5 months ago',
      duration: '3:12:45',
    },
    {
      id: 'longvid3',
      title: 'Documentary: The History of Space Exploration',
      thumbnail: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?auto=format&fit=crop&w=800&q=80',
      channelName: 'Science Channel',
      views: '3.5M',
      timestamp: '1 year ago',
      duration: '4:45:22',
    },
    {
      id: 'longvid4',
      title: 'Learn Piano: Complete Beginner to Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
      channelName: 'Music Academy',
      views: '1.2M',
      timestamp: '8 months ago',
      duration: '10:15:33',
    },
  ];

  // Define supported video and audio formats
  const supportedVideoFormats = ['3gp', '3gpp', 'asf', 'avi', 'dat', 'flv', 'mov', 'mpg', 'mpeg', 'mp4', 'mkv', 'm4v', 'rm', 'wmv'];
  const supportedAudioFormats = ['flac', 'm4a', 'mp3', 'mp4', 'ogg', 'rm', 'vqf', 'wav', 'wma'];

  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Long-Form Videos</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload Long Video</span>
          </button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h2 className="text-xl font-semibold mb-4">Upload Long-Form Content</h2>
              <p className="text-muted-foreground mb-4">
                MiyTube supports videos up to 10 hours in length with no storage restrictions. 
                Perfect for lectures, concerts, documentaries, and other long-form content.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Film size={14} />
                  </div>
                  <div>
                    <p className="font-medium">No Length Restrictions</p>
                    <p className="text-sm text-muted-foreground">Upload videos up to 10 hours in length</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="font-medium">No Expiration</p>
                    <p className="text-sm text-muted-foreground">Your videos remain available forever with no time limitations</p>
                  </div>
                </div>
              </div>
              <button className="mt-6 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                Start Uploading
              </button>
            </div>
            <div className="md:w-1/3 flex items-center justify-center">
              <div className="w-full max-w-xs aspect-video bg-secondary/50 rounded-lg flex items-center justify-center">
                <Clock size={48} className="text-primary" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Info size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">Upload Requirements</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Video Formats</h3>
              <p className="text-sm text-muted-foreground">
                {supportedVideoFormats.join(', ')}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Audio Formats</h3>
              <p className="text-sm text-muted-foreground">
                {supportedAudioFormats.join(', ')}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Resolution</h3>
              <p className="text-sm text-muted-foreground">
                Up to 8K (7680 × 4320) resolution
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">File Size</h3>
              <p className="text-sm text-muted-foreground">
                Up to 128GB per video file
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Frame Rate</h3>
              <p className="text-sm text-muted-foreground">
                Up to 60 frames per second
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">No Time Limits</h3>
              <p className="text-sm text-muted-foreground">
                No expiration dates or time restrictions
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Long-Form Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLongVideos.map((video) => (
              <div key={video.id} className="video-card">
                <a href={`/watch?v=${video.id}`} className="block">
                  <div className="video-thumbnail">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="video-duration">{video.duration}</span>
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <div className="video-meta">
                      <span className="video-channel">{video.channelName}</span>
                      <span className="flex items-center gap-1">
                        <span>{video.views} views</span>
                        <span className="text-xs">•</span>
                        <span>{video.timestamp}</span>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Educational Courses', icon: '🎓' },
              { name: 'Documentaries', icon: '🎬' },
              { name: 'Podcasts', icon: '🎙️' },
              { name: 'Concerts', icon: '🎵' },
              { name: 'Gaming Sessions', icon: '🎮' },
              { name: 'Lectures', icon: '📚' },
              { name: 'Conferences', icon: '👥' },
              { name: 'Audiobooks', icon: '📖' }
            ].map((category) => (
              <div key={category.name} className="bg-card p-4 rounded-lg shadow-sm flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LongVideos;
