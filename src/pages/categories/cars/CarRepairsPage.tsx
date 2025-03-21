
import React from 'react';
import { Layout } from '@/components/Layout';
import { Wrench, Upload, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';

const CarRepairsPage = () => {
  // Sample videos for demo purposes
  const repairVideos = [
    {
      id: 'repair-1',
      title: 'How to Change Your Oil in 15 Minutes',
      thumbnail: 'https://images.unsplash.com/photo-1599240211563-17590b1af857?auto=format&fit=crop&w=800&q=80',
      channelName: 'DIY Mechanic',
      views: '1.8M',
      timestamp: '1 week ago',
      duration: '14:35',
    },
    {
      id: 'repair-2',
      title: 'Engine Diagnostics: The Complete Guide',
      thumbnail: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
      channelName: 'Auto Repair Pro',
      views: '956K',
      timestamp: '3 weeks ago',
      duration: '32:15',
    },
    {
      id: 'repair-3',
      title: 'Car Maintenance Tips Everyone Should Know',
      thumbnail: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80',
      channelName: 'Car Care Channel',
      views: '2.3M',
      timestamp: '2 months ago',
      duration: '18:42',
    },
    {
      id: 'repair-4',
      title: 'Suspension Repair: DIY Guide',
      thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      channelName: 'Auto Enthusiast',
      views: '1.5M',
      timestamp: '5 months ago',
      duration: '22:18',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Link to="/cars" className="hover:text-primary">
            Cars
          </Link>
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
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Car Repair Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {repairVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Repair Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link to="/cars/repairs/major" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Wrench size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Major Repairs</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/repairs/minor" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Wrench size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Minor Repairs</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/repairs/hacks" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Wrench size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Car Hacks</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/repairs/maintenance" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
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
