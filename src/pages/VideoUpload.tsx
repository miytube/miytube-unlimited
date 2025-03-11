
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
import { useCategoryManagement } from '@/components/categories/useCategoryManagement';

const VideoUpload = () => {
  const { toast } = useToast();
  const { addUploadedVideo } = useUploadedVideos();
  const navigate = useNavigate();
  const { categories, addCategory } = useCategoryManagement();
  
  const [newCategory, setNewCategory] = useState('');
  const [videoCategories, setVideoCategories] = useState([
    { id: 'music', name: 'Music', icon: <Film size={20} />, description: 'Upload your music videos, covers, or music-related content.' },
    { id: 'gaming', name: 'Gaming', icon: <Film size={20} />, description: 'Share your gameplay, tutorials, and gaming commentary.' },
    { id: 'sports', name: 'Sports', icon: <Film size={20} />, description: 'Upload videos related to sports, fitness, and athletic activities.' },
    { id: 'education', name: 'Education', icon: <Film size={20} />, description: 'Share educational content, tutorials, and lectures.' },
  ]);
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCategoryObj = {
        id: newCategory.toLowerCase().replace(/\s+/g, '-'),
        name: newCategory,
        icon: <Film size={20} />,
        description: 'Custom video category'
      };
      setVideoCategories([...videoCategories, newCategoryObj]);
      setNewCategory('');
      toast({
        title: "Category Added",
        description: `Added ${newCategory} to video categories`,
      });
    }
  };
  
  const handleUpload = (files: File[], title: string, description: string, category?: string, subcategory?: string, tags?: string[]) => {
    console.log("Video upload initiated:", files, "Title:", title, "Description:", description, "Category:", category, "Subcategory:", subcategory, "Tags:", tags);
    
    toast({
      title: "Video upload started",
      description: `Processing ${files.length} ${files.length === 1 ? 'video' : 'videos'} ${category ? `in category: ${category}` : ''}`,
    });
    
    // Add videos to global context with category information
    files.forEach(file => {
      addUploadedVideo(file, title || file.name, description || '', category, subcategory, tags);
    });
    
    // Simulate upload completion
    setTimeout(() => {
      toast({
        title: "Upload complete",
        description: "Your video has been processed and is now available on the home page and category pages.",
        action: (
          <ToastAction altText="Go to home page" onClick={() => navigate('/')}>
            View Home
          </ToastAction>
        )
      });
    }, 2000);
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <div className="flex items-center gap-3 mb-8">
          <Upload className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Upload Video</h1>
          <p className="text-muted-foreground ml-2">
            Share your videos with the world
          </p>
          <div className="flex items-center gap-2 ml-auto">
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
          {videoCategories.map(category => (
            <Link key={category.id} to={`/${category.id}`} className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
            onClick={() => {
              const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (inputElement) inputElement.focus();
            }}
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
          description="Upload your video directly. Add a title, description, and choose a category to organize your content."
          acceptedTypes="video/*"
          supportedFormats={['MP4', 'MOV', 'WebM', 'AVI', 'FLV', 'MKV']}
          maxSize="128GB"
          onUpload={handleUpload}
          id="quick-upload-input"
          uploadDestination="Your Videos on Home Page and Selected Category"
          categories={videoCategories.map(cat => ({
            id: cat.id,
            name: cat.name
          }))}
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
                <h3 className="font-medium">Category</h3>
                <p className="text-muted-foreground">Your video will also be available on the category page you selected (like Music, Gaming, etc.).</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="font-bold text-primary">3</span>
              </div>
              <div>
                <h3 className="font-medium">Play</h3>
                <p className="text-muted-foreground">Click on your video to watch it with our custom video player.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoUpload;
