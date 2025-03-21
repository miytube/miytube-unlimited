
import React from 'react';
import { Layout } from '@/components/Layout';
import { useSubcategoryInfo } from '@/hooks/useSubcategoryInfo';
import { generateSampleVideos } from '@/utils/sampleVideos';
import SubcategoryHeader from '@/components/subcategory/SubcategoryHeader';
import VideoContent from '@/components/subcategory/VideoContent';
import AboutSection from '@/components/subcategory/AboutSection';

const GenericSubcategoryPage = () => {
  // Get subcategory information from our hook
  const {
    pageTitle,
    pageDescription,
    IconComponent,
    parentRoute,
    parentName,
    mappingKey
  } = useSubcategoryInfo();
  
  // Generate sample videos for the subcategory
  const sampleVideos = generateSampleVideos(mappingKey, pageTitle);
  
  // Create popular videos by slightly modifying sample videos
  const popularVideos = sampleVideos.map((video, index) => ({
    ...video,
    id: `popular-${index}`,
    title: `Popular ${pageTitle} - ${index + 1}`,
  }));

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
        
        <VideoContent 
          title={`Featured ${pageTitle} Content`} 
          videos={sampleVideos} 
        />
        
        <VideoContent 
          title={`Popular in ${pageTitle}`} 
          videos={popularVideos} 
        />
        
        <AboutSection title={pageTitle} />
      </div>
    </Layout>
  );
};

export default GenericSubcategoryPage;
