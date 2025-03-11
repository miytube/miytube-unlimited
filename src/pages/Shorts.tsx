
import React from 'react';
import { Layout } from '@/components/Layout';
import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shorts = () => {
  // Mock data for shorts
  const mockShorts = [
    { id: 's1', title: 'Amazing sunset views', views: '1.2M', creator: 'NatureLover', thumbnail: '/placeholder.svg' },
    { id: 's2', title: 'Quick cooking hack', views: '4.5M', creator: 'ChefMaster', thumbnail: '/placeholder.svg' },
    { id: 's3', title: 'Dance challenge', views: '2.8M', creator: 'DanceKing', thumbnail: '/placeholder.svg' },
    { id: 's4', title: 'DIY home decor', views: '985K', creator: 'CraftyCreator', thumbnail: '/placeholder.svg' },
    { id: 's5', title: 'Tech tip in 30 seconds', views: '1.5M', creator: 'TechGuru', thumbnail: '/placeholder.svg' },
    { id: 's6', title: 'Workout of the day', views: '2.1M', creator: 'FitnessPro', thumbnail: '/placeholder.svg' },
    { id: 's7', title: 'Cute puppy moments', views: '5.3M', creator: 'PetLover', thumbnail: '/placeholder.svg' },
    { id: 's8', title: 'Magic trick revealed', views: '3.4M', creator: 'MagicMaster', thumbnail: '/placeholder.svg' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Film className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Shorts</h1>
        </div>
        <p className="text-muted-foreground">
          Watch short, catchy videos from creators around the world.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mockShorts.map((short) => (
          <Link 
            key={short.id} 
            to={`/shorts/${short.id}`} 
            className="group relative aspect-[9/16] bg-muted rounded-lg overflow-hidden hover:shadow-md transition-all"
          >
            <img 
              src={short.thumbnail} 
              alt={short.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
              <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:underline">
                {short.title}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-white/80">{short.creator}</span>
                <span className="text-xs text-white/80">{short.views}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Shorts;
