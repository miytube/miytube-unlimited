
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Film, Upload, Plus } from 'lucide-react';
import { ShortCard } from '@/components/ShortCard';
import { FileUploader } from '@/components/upload/FileUploader';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const Shorts = () => {
  const { toast } = useToast();
  const { uploadedVideos, getVideosByCategory, addUploadedVideo } = useUploadedVideos();
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    { id: 'trending', name: 'Trending', subcategories: [
      { id: 'challenge', name: 'Challenge' },
      { id: 'viral', name: 'Viral' },
      { id: 'reaction', name: 'Reaction' },
    ]},
    { id: 'dance', name: 'Dance', subcategories: [
      { id: 'choreography', name: 'Choreography' },
      { id: 'freestyle', name: 'Freestyle' },
      { id: 'tutorial', name: 'Tutorial' },
    ]},
    { id: 'comedy', name: 'Comedy', subcategories: [
      { id: 'prank', name: 'Prank' },
      { id: 'skit', name: 'Skit' },
      { id: 'standup', name: 'Stand-up' },
    ]},
    { id: 'music', name: 'Music', subcategories: [
      { id: 'cover', name: 'Cover' },
      { id: 'original', name: 'Original' },
      { id: 'lipsync', name: 'Lip Sync' },
    ]},
    { id: 'diy', name: 'DIY & Crafts', subcategories: [
      { id: 'home', name: 'Home Decor' },
      { id: 'art', name: 'Art & Craft' },
      { id: 'lifehack', name: 'Life Hacks' },
    ]},
    { id: 'cooking', name: 'Cooking', subcategories: [
      { id: 'recipe', name: 'Quick Recipe' },
      { id: 'tips', name: 'Cooking Tips' },
      { id: 'dessert', name: 'Desserts' },
    ]},
  ]);
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCategoryObj = {
        id: `category-${Date.now()}`,
        name: newCategory,
        subcategories: []
      };
      setCategories([...categories, newCategoryObj]);
      setNewCategory('');
      toast({
        title: "Category Added",
        description: `Added ${newCategory} to shorts categories`,
      });
    }
  };
  
  // Get uploaded shorts only (no mock data)
  const uploadedShorts = getVideosByCategory('shorts');
  
  // Format uploaded shorts for ShortCard
  const allShorts = uploadedShorts.map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    creator: 'Your Channel',
    views: video.views,
  }));

  const handleUpload = (files: File[], title: string, description: string, category?: string, subcategory?: string, tags?: string[]) => {
    files.forEach(file => {
      addUploadedVideo(file, title || file.name, description || '', 'shorts', subcategory, tags);
    });
    toast({
      title: "Short video uploaded",
      description: `${files.length} ${files.length === 1 ? 'video' : 'videos'} uploaded successfully.`,
    });
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Shorts</h1>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            onClick={() => {
              document.getElementById('shorts-upload-input')?.click();
            }}
          >
            <Upload size={18} />
            <span>Upload Short</span>
          </button>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Watch and create short, catchy videos from creators around the world.
        </p>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Categories</h2>
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
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category.id} className="bg-muted px-4 py-2 rounded-full font-medium text-sm cursor-pointer hover:bg-primary/10 transition-colors">
                {category.name}
              </div>
            ))}
            <button
              className="bg-muted/50 px-4 py-2 rounded-full font-medium text-sm border-2 border-dashed border-muted-foreground/30 flex items-center gap-1 hover:border-primary/40 transition-colors"
              onClick={() => {
                const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (inputElement) inputElement.focus();
              }}
            >
              <Plus size={14} />
              <span>Add Category</span>
            </button>
          </div>
        </div>
        
        <FileUploader
          icon={Film}
          title="Upload Short Video"
          description="Share quick, engaging content up to 60 seconds long. Perfect for trends, tips, and creative moments."
          acceptedTypes="video/*"
          supportedFormats={['MP4', 'MOV', 'WebM']}
          maxSize="1GB"
          onUpload={handleUpload}
          id="shorts-upload-input"
          uploadDestination="Your Channel > Shorts section"
          categories={categories}
        />
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Trending Shorts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allShorts.map((short) => (
              <ShortCard
                key={short.id}
                id={short.id}
                title={short.title}
                thumbnail={short.thumbnail}
                creator={short.creator}
                views={short.views}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shorts;
