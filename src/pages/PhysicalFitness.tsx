
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Dumbbell, Upload, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const subcategories = [
  { name: 'Weight Lifting', route: '/physical-fitness/weight-lifting' },
  { name: 'Weightlifting Female', route: '/physical-fitness/weightlifting-female' },
  { name: 'Weightlifting Male', route: '/physical-fitness/weightlifting-male' },
  { name: 'Workers', route: '/physical-fitness/workers' },
  { name: 'Workout', route: '/physical-fitness/workout' },
  { name: 'Workout Female', route: '/physical-fitness/workout-female' },
  { name: 'Workout Fitness', route: '/physical-fitness/workout-fitness' },
  { name: 'Workout Male', route: '/physical-fitness/workout-male' },
  { name: 'Yoga Workout', route: '/physical-fitness/yoga-workout' },
  { name: 'Calisthenics', route: '/physical-fitness/calisthenics' },
];

const PhysicalFitness = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  const fitnessKeywords = ['fitness', 'workout', 'weightlifting', 'weight lifting', 'gym', 'exercise', 'yoga', 'calisthenics', 'training', 'muscle', 'bodybuilding', 'crossfit'];
  
  const fitnessVideos = uploadedVideos.filter(video => {
    const category = video.category?.toLowerCase() || '';
    const subcategory = video.subcategory?.toLowerCase() || '';
    const tags = video.tags?.map(t => t.toLowerCase()) || [];
    
    return fitnessKeywords.some(keyword => 
      category.includes(keyword) || 
      subcategory.includes(keyword) ||
      tags.some(tag => tag.includes(keyword))
    );
  });

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">MiyTube</span>
          <ChevronRight size={14} />
          <span className="text-foreground">Physical Fitness</span>
        </div>
        
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Physical Fitness</h1>
            </div>
            <p className="text-muted-foreground">
              Workout videos, weightlifting, yoga, and fitness content
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload</span>
          </Link>
        </div>

        {/* Subcategories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Link
                key={sub.route}
                to={sub.route}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors text-sm"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Videos */}
        {fitnessVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Physical Fitness Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fitnessVideos.slice(0, 20).map((video) => (
                <VideoCard 
                  key={video.id} 
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelName="Your Channel"
                  views={video.views}
                  timestamp={video.timestamp}
                  duration={video.duration}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <Dumbbell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Fitness Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload fitness content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Fitness Content</span>
            </Link>
          </div>
        )}

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">About Physical Fitness</h2>
          <p className="text-muted-foreground">
            Discover workout routines, weightlifting techniques, yoga sessions, and fitness inspiration.
            Whether you're into bodybuilding, calisthenics, or general fitness, find content to help you reach your goals.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PhysicalFitness;
