
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Film, Upload, Plus } from 'lucide-react';
import { ShortCard } from '@/components/ShortCard';
import { FileUploader } from '@/components/upload/FileUploader';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Shorts = () => {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    { id: 'trending', name: 'Trending' },
    { id: 'dance', name: 'Dance' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'music', name: 'Music' },
    { id: 'diy', name: 'DIY & Crafts' },
    { id: 'cooking', name: 'Cooking' },
  ]);
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCategoryObj = {
        id: `category-${Date.now()}`,
        name: newCategory
      };
      setCategories([...categories, newCategoryObj]);
      setNewCategory('');
      toast({
        title: "Category Added",
        description: `Added ${newCategory} to shorts categories`,
      });
    }
  };
  
  // Mock data for shorts
  const mockShorts = [
    { 
      id: 's1', 
      title: 'Amazing sunset views', 
      views: '1.2M', 
      creator: 'NatureLover', 
      thumbnail: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 's2', 
      title: 'Quick cooking hack', 
      views: '4.5M', 
      creator: 'ChefMaster', 
      thumbnail: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 's3', 
      title: 'Dance challenge', 
      views: '2.8M', 
      creator: 'DanceKing', 
      thumbnail: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 's4', 
      title: 'DIY home decor', 
      views: '985K', 
      creator: 'CraftyCreator', 
      thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 's5', 
      title: 'Tech tip in 30 seconds', 
      views: '1.5M', 
      creator: 'TechGuru', 
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 's6', 
      title: 'Workout of the day', 
      views: '2.1M', 
      creator: 'FitnessPro', 
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 's7', 
      title: 'Cute puppy moments', 
      views: '5.3M', 
      creator: 'PetLover', 
      thumbnail: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 's8', 
      title: 'Magic trick revealed', 
      views: '3.4M', 
      creator: 'MagicMaster', 
      thumbnail: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80' 
    },
  ];

  const handleUpload = (files: File[]) => {
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
        />
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Trending Shorts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mockShorts.map((short) => (
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
