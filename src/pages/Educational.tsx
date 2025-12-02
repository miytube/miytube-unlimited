
import React from 'react';
import { Layout } from '@/components/Layout';
import { GraduationCap, Upload, BookOpen, Globe, Calculator, Microscope, History, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';

const Educational = () => {
  // Generate 20 sample videos for 4x5 grid
  const educationalVideos = Array.from({ length: 20 }, (_, i) => ({
    id: `education-${i + 1}`,
    title: `Education Content ${i + 1}`,
    thumbnail: `https://images.unsplash.com/photo-${1550745165 + i * 1000}-9bc0b252726f?auto=format&fit=crop&w=800&q=80`,
    channelName: `Education Creator ${(i % 5) + 1}`,
    views: `${Math.floor(Math.random() * 900) + 100}K`,
    timestamp: `${(i % 7) + 1} days ago`,
    duration: `${Math.floor(Math.random() * 20) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  }));

  const educationCategories = [
    { name: 'Anatomy', icon: Microscope, route: '/education-anatomy' },
    { name: 'Countries History', icon: Globe, route: '/education-countries' },
    { name: 'Kids Geography', icon: Globe, route: '/education-kids-geography' },
    { name: 'Laws & Constitution', icon: BookOpen, route: '/education-laws' },
    { name: 'Immigration', icon: Globe, route: '/education-immigration' },
    { name: 'American History', icon: History, route: '/american-history' },
  ];
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Education
        </p>
        
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Education</h1>
            <p className="text-muted-foreground ml-2">
              Discover and enjoy education content
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload</span>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Education Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {educationCategories.map((category, index) => (
              <Link key={index} to={category.route} className="block">
                <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                  <div className="text-center p-2">
                    <category.icon size={32} className="mx-auto mb-2 text-primary" />
                    <div className="font-medium text-xs">{category.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Education Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {educationalVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Popular in Education</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {educationalVideos.slice(0, 20).map((video, index) => ({
              ...video,
              id: `popular-education-${index}`,
              title: `Popular Education - ${index + 1}`,
            })).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About Education</h2>
          <p className="text-muted-foreground">
            This category features content related to education. Explore videos, shorts, and more from creators specializing in this area.
          </p>
          <div className="mt-4">
            <Link to="/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <Upload size={18} />
              <span>Upload Education Content</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Educational;
