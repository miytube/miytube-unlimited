
import React from 'react';
import { Layout } from '@/components/Layout';
import { Car, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';

const CarsPage = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Filter for car-related videos using strict matching
  const carKeywords = ['cars', 'car', 'cars-repairs', 'cars-drifting', 'cars-expensive', 'cars-future', 'cars-types', 'cars-strange', 'cars-supercars', 'cars-accidents'];
  const carVideos = filterVideosByCategory(uploadedVideos, 'cars', carKeywords);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Cars
        </p>
        
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Cars</h1>
            <p className="text-muted-foreground ml-2">
              Everything automotive - from supercars to repairs
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Car Content</span>
          </Link>
        </div>
        
        {carVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Car Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {carVideos.slice(0, 20).map((video) => (
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
            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Car Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload car content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Car Content</span>
            </Link>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">Car Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/cars/repairs/major" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Major Repairs</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/repairs/minor" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Minor Repairs</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/drifting" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Drifting</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/expensive" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Luxury & Expensive</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/future" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Future Vehicles</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/types" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Car Types</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/strange" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Strange & Weird</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/supercars" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Supercars</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/accidents" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Accidents</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CarsPage;
