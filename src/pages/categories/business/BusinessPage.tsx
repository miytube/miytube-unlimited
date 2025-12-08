
import React from 'react';
import { Layout } from '@/components/Layout';
import { BarChart, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const BusinessPage = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Filter for business-related videos using strict matching
  const businessKeywords = ['business', 'cryptocurrency', 'finance', 'leadership', 'commerce', 'trade', 'business-cryptocurrency', 'business-leadership', 'business-finance', 'business-services', 'business-farming', 'business-commerce', 'business-internet'];
  const businessVideos = filterVideosByCategory(uploadedVideos, 'business', businessKeywords);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Business
        </p>
        
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
        
        {businessVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Business Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {businessVideos.slice(0, 20).map((video) => (
                <VideoCard 
                  key={video.id} 
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelName="Your Channel"
                  views={video.views}
                  timestamp={video.timestamp}
                  duration={video.duration}
                  description={video.description}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Business Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload business content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Business Content</span>
            </Link>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">Business Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Link to="/business/cryptocurrency" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Cryptocurrency</div>
                </div>
              </div>
            </Link>
            <Link to="/business/leadership" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Leadership</div>
                </div>
              </div>
            </Link>
            <Link to="/business/finance" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Finance & Taxes</div>
                </div>
              </div>
            </Link>
            <Link to="/business/services" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Services</div>
                </div>
              </div>
            </Link>
            <Link to="/business/farming" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Farming</div>
                </div>
              </div>
            </Link>
            <Link to="/business/commerce" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <BarChart size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Commerce & Trade</div>
                </div>
              </div>
            </Link>
            <Link to="/business/internet" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
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
