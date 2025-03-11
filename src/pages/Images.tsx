
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Image, Upload, Grid } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';
import { useToast } from "@/hooks/use-toast";

const imageSamples = [
  {
    id: 'img1',
    url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
    title: 'Mountain Landscape',
    author: 'Nature Photography',
    views: '24K',
  },
  {
    id: 'img2',
    url: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=800&q=80',
    title: 'Cityscape at Night',
    author: 'Urban Explorer',
    views: '18K',
  },
  {
    id: 'img3',
    url: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?auto=format&fit=crop&w=800&q=80',
    title: 'Abstract Art Composition',
    author: 'Creative Arts',
    views: '42K',
  },
  {
    id: 'img4',
    url: 'https://images.unsplash.com/photo-1623944889288-133601606cd9?auto=format&fit=crop&w=800&q=80',
    title: 'Wildlife Photography',
    author: 'Animal World',
    views: '31K',
  },
  {
    id: 'img5',
    url: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=800&q=80',
    title: 'Ocean Sunset',
    author: 'Travel Moments',
    views: '56K',
  },
  {
    id: 'img6',
    url: 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?auto=format&fit=crop&w=800&q=80',
    title: 'Flower Closeup',
    author: 'Macro Photography',
    views: '15K',
  },
];

const Images = () => {
  const { toast } = useToast();
  
  const handleUpload = (files: File[]) => {
    toast({
      title: "Images uploaded",
      description: `${files.length} ${files.length === 1 ? 'image' : 'images'} uploaded successfully.`,
    });
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">MiyTube Images</h1>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            onClick={() => {
              document.getElementById('image-upload-input')?.click();
            }}
          >
            <Upload size={18} />
            <span>Upload Images</span>
          </button>
        </div>
        
        <FileUploader
          icon={Image}
          title="Upload and Share Images"
          description="Share your photography and artwork with the MiyTube community. Upload high-resolution images with no time restrictions."
          acceptedTypes="image/jpeg,image/png,image/webp"
          supportedFormats={['JPG', 'PNG', 'WebP']}
          maxSize="50MB"
          onUpload={handleUpload}
          id="image-upload-input"
        />
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Featured Images</h2>
            <div className="flex gap-2">
              <button className="p-2 bg-secondary rounded-md">
                <Grid size={20} />
              </button>
              <select className="bg-secondary px-3 py-2 rounded-md text-sm">
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Trending</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageSamples.map((image) => (
              <div key={image.id} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{image.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{image.author}</span>
                    <span>{image.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Image Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Nature', 'Urban', 'People', 'Animals', 'Art', 'Technology', 'Food', 'Travel', 'Sports', 'Abstract', 'Vehicles', 'Architecture'].map((category) => (
              <div key={category} className="aspect-square rounded-lg overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white font-medium">{category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Images;
