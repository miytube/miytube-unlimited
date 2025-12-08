
import React from 'react';
import { Layout } from '@/components/Layout';
import { useSubcategoryInfo } from '@/hooks/useSubcategoryInfo';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import SubcategoryHeader from '@/components/subcategory/SubcategoryHeader';
import VideoContent from '@/components/subcategory/VideoContent';
import AboutSection from '@/components/subcategory/AboutSection';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';

const GenericSubcategoryPage = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Get subcategory information from our hook
  const {
    pageTitle,
    pageDescription,
    IconComponent,
    parentRoute,
    parentName,
    mappingKey
  } = useSubcategoryInfo();
  
  // Filter videos for this subcategory
  const titleLower = pageTitle.toLowerCase();
  const keyLower = mappingKey.toLowerCase();
  
  // Extract core keywords from mapping key (e.g., "sports-mlb-world-series" -> ["mlb", "world", "series"])
  const keyWords = keyLower.split('-').filter(w => w.length > 2);
  
  const subcategoryVideos = uploadedVideos.filter(video => {
    const vidCategory = video.category?.toLowerCase() || '';
    const vidSubcategory = video.subcategory?.toLowerCase() || '';
    const vidTags = video.tags?.map(t => t.toLowerCase()) || [];
    
    // Exact match on title
    if (vidCategory === titleLower || vidSubcategory === titleLower) return true;
    
    // Check if category/subcategory contains the page title (e.g., "MLB World Series" includes "mlb world series")
    if (vidCategory.includes(titleLower) || vidSubcategory.includes(titleLower)) return true;
    
    // Check if key matches
    if (vidCategory.includes(keyLower) || vidSubcategory.includes(keyLower)) return true;
    
    // Check if all key words are present in category or subcategory
    const combinedText = `${vidCategory} ${vidSubcategory}`;
    if (keyWords.length >= 2 && keyWords.every(word => combinedText.includes(word))) return true;
    
    // Check tags
    if (vidTags.some(tag => tag.includes(titleLower) || tag.includes(keyLower))) return true;
    if (vidTags.some(tag => keyWords.every(word => tag.includes(word)))) return true;
    
    return false;
  });

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <SubcategoryHeader
          parentRoute={parentRoute}
          parentName={parentName}
          pageTitle={pageTitle}
          pageDescription={pageDescription}
          IconComponent={IconComponent}
        />
        
        {subcategoryVideos.length > 0 ? (
          <VideoContent 
            title={`${pageTitle} Videos`} 
            videos={subcategoryVideos.map(v => ({
              id: v.id,
              title: v.title,
              thumbnail: v.thumbnail,
              channelName: 'Your Channel',
              views: v.views,
              timestamp: v.timestamp,
              duration: v.duration,
            }))} 
          />
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <IconComponent className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No {pageTitle} Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload {pageTitle.toLowerCase()} content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {pageTitle} Content</span>
            </Link>
          </div>
        )}
        
        <AboutSection title={pageTitle} />
      </div>
    </Layout>
  );
};

export default GenericSubcategoryPage;
