import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { Film, Upload, Plus } from 'lucide-react';
import { ShortCard } from '@/components/ShortCard';
import { FileUploader } from '@/components/upload/FileUploader';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { Pagination, PageInfo } from '@/components/Pagination';
import { ShortGridSkeleton } from '@/components/skeletons';

const Shorts = () => {
  const { toast } = useToast();
  const { uploadedVideos, getVideosByCategory, addUploadedVideo, isLoading } = useUploadedVideos();
  const [newCategory, setNewCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const shortsPerPage = 20;
  const uploadedShorts = getVideosByCategory('shorts');
  const prevShortsCount = useRef(uploadedShorts.length);

  // Reset to page 1 when new shorts are added
  useEffect(() => {
    if (uploadedShorts.length > prevShortsCount.current) {
      setCurrentPage(1);
    }
    prevShortsCount.current = uploadedShorts.length;
  }, [uploadedShorts.length]);
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
  
  // Format uploaded shorts for ShortCard - newest first
  // Format uploaded shorts for ShortCard - newest first
  const allShorts = [...uploadedShorts].reverse().map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    creator: 'Your Channel',
    views: video.views,
    description: video.description,
    category: video.category,
    subcategory: video.subcategory,
    tags: video.tags,
  }));

  // Pagination logic
  const totalPages = Math.ceil(allShorts.length / shortsPerPage);
  const startIndex = (currentPage - 1) * shortsPerPage;
  const shortsToDisplay = allShorts.slice(startIndex, startIndex + shortsPerPage);

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
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
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
              <Link 
                key={category.id} 
                to={`/${category.id === 'diy' ? 'how-to-style' : category.id === 'cooking' ? 'foods' : category.id}`}
                className="bg-muted px-4 py-2 rounded-full font-medium text-sm cursor-pointer hover:bg-primary/10 transition-colors"
              >
                {category.name}
              </Link>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Shorts</h2>
            {!isLoading && (
              <PageInfo 
                currentPage={currentPage} 
                totalPages={totalPages} 
                totalItems={allShorts.length} 
                itemLabel="shorts" 
              />
            )}
          </div>
          
          {isLoading ? (
            <ShortGridSkeleton count={8} />
          ) : shortsToDisplay.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {shortsToDisplay.map((short) => (
                  <ShortCard
                    key={short.id}
                    id={short.id}
                    title={short.title}
                    thumbnail={short.thumbnail}
                    creator={short.creator}
                    views={short.views}
                    description={short.description}
                    category={short.category}
                    subcategory={short.subcategory}
                    tags={short.tags}
                  />
                ))}
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
              <p>No shorts uploaded yet. Use the uploader above to add your first short!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Shorts;
