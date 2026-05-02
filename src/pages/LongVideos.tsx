
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { LongVideosHeader } from '@/components/longVideos/LongVideosHeader';
import { FeaturedLongVideos } from '@/components/longVideos/FeaturedLongVideos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useNavigate } from 'react-router-dom';
import { sortByName } from '@/lib/sortByName';

const LongVideos = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { uploadedVideos } = useUploadedVideos();
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

  // Filter uploaded videos for long-form content
  // Include videos >1 minute OR matching exact long-form categories
  const longFormCategories = ['long-videos', 'meditation', 'educational', 'documentary', 'podcast', 'lecture', 'conference', 'audiobook', 'concert'];
  
  const longFormVideos = uploadedVideos.filter(video => {
    // Parse duration string to check if it's a long video
    const durationParts = video.duration?.split(':') || [];
    let totalSeconds = 0;
    if (durationParts.length === 3) {
      totalSeconds = parseInt(durationParts[0]) * 3600 + parseInt(durationParts[1]) * 60 + parseInt(durationParts[2]);
    } else if (durationParts.length === 2) {
      totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
    }
    // Consider videos longer than 1 minute as long-form
    const isLongDuration = totalSeconds > 60;
    
    // Check for exact category match (no loose includes)
    const vidCategory = video.category?.toLowerCase().trim() || '';
    const vidSubcategory = video.subcategory?.toLowerCase().trim() || '';
    const isLongFormCategory = longFormCategories.some(cat => 
      vidCategory === cat || vidSubcategory === cat
    );
    return isLongDuration || isLongFormCategory;
  });

  const handleUploadClick = () => {
    navigate('/upload/video');
  };
  
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

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <LongVideosHeader onUploadClick={handleUploadClick} />
        
        {longFormVideos.length > 0 && (
          <FeaturedLongVideos videos={longFormVideos.map(video => ({
            id: video.id,
            title: video.title,
            thumbnail: video.thumbnail,
            channelName: 'Your Channel',
            views: video.views,
            timestamp: video.timestamp,
            duration: video.duration,
          }))} />
        )}
        
        {longFormVideos.length === 0 && (
          <div className="mb-8 p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">No long-form videos yet. Upload videos longer than 10 minutes to see them here.</p>
            <Button onClick={handleUploadClick}>Upload Long Video</Button>
          </div>
        )}
        
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
            {sortByName(videoCategories).map((category, index) => (
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
