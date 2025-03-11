
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { FileUploader } from '@/components/upload/FileUploader';
import { Film, Upload, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { ToastAction } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VideoUpload = () => {
  const { toast } = useToast();
  const { addUploadedVideo } = useUploadedVideos();
  const navigate = useNavigate();
  
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    { id: 'long', name: 'Long-Form Videos', icon: <Film size={20} />, description: 'Upload videos up to 10 hours in length. Perfect for lectures, tutorials, and documentaries.' },
    { id: 'short', name: 'Short Videos', icon: <Film size={20} />, description: 'Create catchy videos up to 60 seconds. Great for trends, quick tips, and creative moments.' },
  ]);
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCategoryObj = {
        id: `category-${Date.now()}`,
        name: newCategory,
        icon: <Film size={20} />,
        description: 'Custom video category'
      };
      setCategories([...categories, newCategoryObj]);
      setNewCategory('');
      toast({
        title: "Category Added",
        description: `Added ${newCategory} to video categories`,
      });
    }
  };
  
  const handleUpload = (files: File[]) => {
    console.log("Video upload initiated:", files);
    
    toast({
      title: "Video upload started",
      description: `Processing ${files.length} ${files.length === 1 ? 'video' : 'videos'}. This may take a few minutes.`,
    });
    
    // Add videos to global context
    files.forEach(file => {
      addUploadedVideo(file);
    });
    
    // Simulate upload completion
    setTimeout(() => {
      toast({
        title: "Upload complete",
        description: "Your video has been processed and is now available on the home page and can be played directly.",
        action: (
          <ToastAction altText="Go to home page" onClick={() => navigate('/')}>
            View Home
          </ToastAction>
        )
      });
    }, 3000);
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Upload Video</h1>
          </div>
          <div className="flex items-center gap-2">
            <Input 
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={handleAddCategory} size="sm">
              <Plus size={16} className="mr-1" /> Add Category
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map(category => (
            <Link key={category.id} to={`/${category.id}-videos`} className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                {category.icon} {category.name}
              </h2>
              <p className="text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
          
          <button 
            className="bg-card p-6 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors cursor-pointer h-full text-center"
            onClick={() => document.querySelector('input[type="text"]')?.focus()}
          >
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Plus size={24} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Create New Category</h2>
            <p className="text-muted-foreground">
              Add a custom video category for your specialized content
            </p>
          </button>
        </div>
        
        <FileUploader
          icon={Film}
          title="Quick Upload"
          description="Upload your video directly. Your videos will appear on the home page and you can play them directly from there."
          acceptedTypes="video/*"
          supportedFormats={['MP4', 'MOV', 'WebM', 'AVI', 'FLV', 'MKV']}
          maxSize="128GB"
          onUpload={handleUpload}
          id="quick-upload-input"
          uploadDestination="Your Videos on Home Page"
        />
        
        <div className="bg-card p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-semibold mb-4">After Upload</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="font-bold text-primary">1</span>
              </div>
              <div>
                <h3 className="font-medium">Processing</h3>
                <p className="text-muted-foreground">Your video will be processed and appear on the home page.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="font-bold text-primary">2</span>
              </div>
              <div>
                <h3 className="font-medium">Preview</h3>
                <p className="text-muted-foreground">Once uploaded, you can play your video directly from the home page.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="font-bold text-primary">3</span>
              </div>
              <div>
                <h3 className="font-medium">Publish</h3>
                <p className="text-muted-foreground">Your videos will be automatically published on the home page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoUpload;
