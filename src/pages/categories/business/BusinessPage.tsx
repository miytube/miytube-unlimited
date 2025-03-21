
import React from 'react';
import { Layout } from '@/components/Layout';
import { BarChart, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';

const BusinessPage = () => {
  // Sample videos for demo purposes
  const businessVideos = [
    {
      id: 'business-1',
      title: 'Cryptocurrency Investment Strategies',
      thumbnail: 'https://images.unsplash.com/photo-1518544866330-3b7c3e37e681?auto=format&fit=crop&w=800&q=80',
      channelName: 'Crypto Insights',
      views: '1.2M',
      timestamp: '3 days ago',
      duration: '24:35',
    },
    {
      id: 'business-2',
      title: 'Business Leadership Masterclass',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      channelName: 'Leadership Academy',
      views: '856K',
      timestamp: '1 week ago',
      duration: '42:15',
    },
    {
      id: 'business-3',
      title: 'Tax Planning for Entrepreneurs',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
      channelName: 'Business Finance',
      views: '2.3M',
      timestamp: '2 months ago',
      duration: '18:42',
    },
    {
      id: 'business-4',
      title: 'Drone Services for Business',
      thumbnail: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80',
      channelName: 'Tech for Business',
      views: '4.5M',
      timestamp: '5 months ago',
      duration: '15:18',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <BarChart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Business</h1>
            <p className="text-muted-foreground ml-2">
              Business insights, cryptocurrency, leadership, and finance
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Business Content</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Business Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businessVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Business Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Link to="/business/cryptocurrency" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Cryptocurrency</div>
                </div>
              </div>
            </Link>
            <Link to="/business/leadership" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Leadership</div>
                </div>
              </div>
            </Link>
            <Link to="/business/finance" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Finance & Taxes</div>
                </div>
              </div>
            </Link>
            <Link to="/business/services" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Services</div>
                </div>
              </div>
            </Link>
            <Link to="/business/farming" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Farming</div>
                </div>
              </div>
            </Link>
            <Link to="/business/commerce" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Commerce & Trade</div>
                </div>
              </div>
            </Link>
            <Link to="/business/internet" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Internet & Platforms</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessPage;
