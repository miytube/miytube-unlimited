
import React from 'react';
import { Layout } from '@/components/Layout';
import { Car, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';

const CarsPage = () => {
  // Sample videos for demo purposes
  const carVideos = [
    {
      id: 'cars-1',
      title: 'Supercar Showdown 2023',
      thumbnail: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
      channelName: 'Car Enthusiast',
      views: '2.3M',
      timestamp: '1 week ago',
      duration: '15:35',
    },
    {
      id: 'cars-2',
      title: 'DIY: Minor Car Repairs Anyone Can Do',
      thumbnail: 'https://images.unsplash.com/photo-1599237847736-9a2e5673a1bc?auto=format&fit=crop&w=800&q=80',
      channelName: 'Auto Repair',
      views: '1.1M',
      timestamp: '2 weeks ago',
      duration: '22:15',
    },
    {
      id: 'cars-3',
      title: 'Drifting Techniques for Beginners',
      thumbnail: 'https://images.unsplash.com/photo-1557988362-a1caacedeb7b?auto=format&fit=crop&w=800&q=80',
      channelName: 'Drift Masters',
      views: '3.4M',
      timestamp: '1 month ago',
      duration: '18:42',
    },
    {
      id: 'cars-4',
      title: 'The Most Expensive Cars in the World',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      channelName: 'Luxury Cars',
      views: '5.2M',
      timestamp: '3 months ago',
      duration: '13:18',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
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
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Car Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {carVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Car Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/cars/repairs/major" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Major Repairs</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/repairs/minor" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Minor Repairs</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/drifting" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Drifting</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/expensive" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Luxury & Expensive</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/future" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Future Vehicles</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/types" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Car Types</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/strange" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Strange & Weird</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/supercars" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
                <div className="text-center">
                  <Car size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">Supercars</div>
                </div>
              </div>
            </Link>
            <Link to="/cars/accidents" className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
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
