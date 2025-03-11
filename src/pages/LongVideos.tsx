
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Film, Plus } from 'lucide-react';
import { FileUploader } from '@/components/upload/FileUploader';
import { useToast } from "@/hooks/use-toast";
import { LongVideosHeader } from '@/components/longVideos/LongVideosHeader';
import { UploadRequirements } from '@/components/longVideos/UploadRequirements';
import { FeaturedLongVideos } from '@/components/longVideos/FeaturedLongVideos';
import { VideoCategories } from '@/components/longVideos/VideoCategories';
import { 
  featuredLongVideos, 
  supportedVideoFormats, 
  supportedAudioFormats,
} from '@/components/longVideos/longVideosData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LongVideos = () => {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState('');
  const [videoCategories, setVideoCategories] = useState([
    { name: 'Educational Courses', icon: '🎓' },
    { name: 'Documentaries', icon: '🎬' },
    { name: 'Podcasts', icon: '🎙️' },
    { name: 'Concerts', icon: '🎵' },
    { name: 'Gaming Sessions', icon: '🎮' },
    { name: 'Lectures', icon: '📚' },
    { name: 'Conferences', icon: '👥' },
    { name: 'Audiobooks', icon: '📖' }
  ]);
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCategoryObj = {
        name: newCategory,
        icon: '📹'
      };
      setVideoCategories([...videoCategories, newCategoryObj]);
      setNewCategory('');
      toast({
        title: "Category Added",
        description: `Added ${newCategory} to video categories`,
      });
    }
  };
  
  const handleUpload = (files: File[]) => {
    toast({
      title: "Video uploaded",
      description: `${files.length} ${files.length === 1 ? 'video' : 'videos'} uploaded successfully.`,
    });
  };

  const handleUploadClick = () => {
    document.getElementById('video-upload-input')?.click();
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <LongVideosHeader onUploadClick={handleUploadClick} />
        
        <FileUploader
          icon={Film}
          title="Upload Long-Form Content"
          description="MiyTube supports videos up to 10 hours in length with no storage restrictions. Perfect for lectures, concerts, documentaries, and other long-form content."
          acceptedTypes="video/*"
          supportedFormats={supportedVideoFormats}
          maxSize="128GB"
          onUpload={handleUpload}
          id="video-upload-input"
          uploadDestination="Your Channel > Long Videos section"
        />
        
        <UploadRequirements 
          videoFormats={supportedVideoFormats}
          audioFormats={supportedAudioFormats}
        />
        
        <FeaturedLongVideos videos={featuredLongVideos} />
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Categories</h2>
            <div className="flex gap-2">
              <Input 
                type="text"
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="max-w-[200px]"
              />
              <Button onClick={handleAddCategory} size="sm">
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videoCategories.map((category, index) => (
              <div key={index} className="bg-card p-4 rounded-lg shadow-sm flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </div>
            ))}
            <button 
              className="bg-card p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center gap-3 hover:border-primary/40 transition-colors cursor-pointer"
              onClick={() => {
                const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (inputElement) inputElement.focus();
              }}
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50">
                <Plus size={16} className="text-muted-foreground" />
              </span>
              <span className="font-medium text-muted-foreground">Add Category</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LongVideos;
