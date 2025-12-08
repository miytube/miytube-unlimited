
import React from 'react';
import { Layout } from '@/components/Layout';
import { Wrench, Upload, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const CarRepairsPage = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Filter for car repair-related videos using strict matching
  const repairKeywords = ['car-repairs', 'cars-repairs', 'cars-repairs-major', 'cars-repairs-minor', 'cars-repairs-hacks', 'cars-repairs-maintenance'];
  const repairVideos = filterVideosByCategory(uploadedVideos, 'car-repairs', repairKeywords);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">MiyTube</span>
          <ChevronRight size={14} />
          <Link to="/cars" className="hover:text-primary">Cars</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Repairs</span>
        </div>
        
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Wrench className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Car Repairs</h1>
            <p className="text-muted-foreground ml-2">
              Fix it yourself - car repairs and maintenance
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Repair Content</span>
          </Link>
        </div>
        
        {repairVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Car Repair Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {repairVideos.slice(0, 20).map((video) => (
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
            <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Car Repair Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload car repair content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Repair Content</span>
            </Link>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">Repair Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link to="/cars/repairs/major" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Wrench size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Major Repairs</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/repairs/minor" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Wrench size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Minor Repairs</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/repairs/hacks" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Wrench size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Car Hacks</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/repairs/maintenance" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Wrench size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Maintenance</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CarRepairsPage;
