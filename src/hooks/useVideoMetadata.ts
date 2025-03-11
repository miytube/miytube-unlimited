
import { useState, useEffect } from 'react';

interface UseVideoMetadataProps {
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCategory?: string;
}

export const useVideoMetadata = ({
  defaultTitle = '',
  defaultDescription = '',
  defaultCategory = ''
}: UseVideoMetadataProps = {}) => {
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  // Set default values when props change
  useEffect(() => {
    if (defaultTitle && !videoTitle) setVideoTitle(defaultTitle);
    if (defaultDescription && !videoDescription) setVideoDescription(defaultDescription);
    if (defaultCategory && !selectedCategory) setSelectedCategory(defaultCategory);
  }, [defaultTitle, defaultDescription, defaultCategory, videoTitle, videoDescription, selectedCategory]);

  const extractTagsFromFilename = (fileName: string) => {
    const potentialTags = fileName
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3);
    
    if (potentialTags.length > 0) {
      setTags(potentialTags);
    }
  };

  const setMetadataFromFile = (file: File) => {
    if (!file) return;
    
    const fileName = file.name.split('.').slice(0, -1).join('.');
    
    if (!videoTitle) {
      setVideoTitle(fileName);
    }
    
    if (!videoDescription) {
      setVideoDescription(`Video about ${fileName}`);
    }
    
    extractTagsFromFilename(fileName);
  };

  return {
    videoTitle,
    setVideoTitle,
    videoDescription,
    setVideoDescription,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    tags,
    setTags,
    setMetadataFromFile
  };
};
