import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { FileUploader } from '@/components/upload/FileUploader';
import { Film, Video, Music, Image, FileText, Upload as UploadIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { ToastAction } from '@/components/ui/toast';
import { UploadRequirements } from '@/components/longVideos/UploadRequirements';
import { MusicUploadRequirements } from '@/components/music/UploadRequirements';

interface ContentType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  acceptedTypes: string;
  supportedFormats: string[];
  maxSize: string;
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string }>
  }>;
  destination: string;
}

const Upload = () => {
  const { toast } = useToast();
  const { addUploadedVideo } = useUploadedVideos();
  const navigate = useNavigate();
  
  const [selectedContentType, setSelectedContentType] = useState<string>("video");
  
  const contentTypes: Record<string, ContentType> = {
    video: {
      id: "video",
      name: "Regular Video",
      icon: Video,
      description: "Upload your full-length videos, tutorials, and other video content.",
      acceptedTypes: "video/*",
      supportedFormats: ['MP4', 'MOV', 'WebM', 'AVI', 'FLV', 'MKV'],
      maxSize: "128GB",
      categories: [
        { id: 'music', name: 'Music', subcategories: [
          { id: 'pop', name: 'Pop' },
          { id: 'rock', name: 'Rock' },
          { id: 'hiphop', name: 'Hip Hop' },
        ]},
        { id: 'gaming', name: 'Gaming', subcategories: [
          { id: 'fps', name: 'FPS Games' },
          { id: 'rpg', name: 'RPG Games' },
          { id: 'strategy', name: 'Strategy Games' },
        ]},
        { id: 'education', name: 'Education', subcategories: [
          { id: 'science', name: 'Science' },
          { id: 'math', name: 'Mathematics' },
          { id: 'history', name: 'History' },
        ]},
      ],
      destination: "Your Videos on Home Page and Selected Category"
    },
    shorts: {
      id: "shorts",
      name: "Shorts",
      icon: Film,
      description: "Upload short-form vertical videos. Perfect for quick, engaging content under 60 seconds.",
      acceptedTypes: "video/*",
      supportedFormats: ['MP4', 'MOV', 'WebM'],
      maxSize: "10GB",
      categories: [
        { id: 'trending', name: 'Trending', subcategories: [
          { id: 'challenge', name: 'Challenge' },
          { id: 'dance', name: 'Dance' },
        ]},
        { id: 'comedy', name: 'Comedy', subcategories: [
          { id: 'prank', name: 'Prank' },
          { id: 'skit', name: 'Skit' },
        ]},
      ],
      destination: "Shorts Feed"
    },
    music: {
      id: "music",
      name: "Music",
      icon: Music,
      description: "Upload your music tracks, covers, remixes, and audio content.",
      acceptedTypes: "audio/*",
      supportedFormats: ['MP3', 'WAV', 'AAC', 'FLAC', 'OGG'],
      maxSize: "10GB",
      categories: [
        { id: 'pop', name: 'Pop', subcategories: [
          { id: 'dance-pop', name: 'Dance Pop' },
          { id: 'indie-pop', name: 'Indie Pop' },
        ]},
        { id: 'rock', name: 'Rock', subcategories: [
          { id: 'alt-rock', name: 'Alternative Rock' },
          { id: 'classic-rock', name: 'Classic Rock' },
        ]},
        { id: 'hiphop', name: 'Hip Hop', subcategories: [
          { id: 'trap', name: 'Trap' },
          { id: 'lofi', name: 'Lo-Fi' },
        ]},
        { id: 'electronic', name: 'Electronic', subcategories: [
          { id: 'house', name: 'House' },
          { id: 'techno', name: 'Techno' },
          { id: 'ambient', name: 'Ambient' },
        ]},
      ],
      destination: "Music Page and Player"
    },
    image: {
      id: "image",
      name: "Image",
      icon: Image,
      description: "Upload your photos, illustrations, graphics, and visual content.",
      acceptedTypes: "image/*",
      supportedFormats: ['JPG', 'PNG', 'GIF', 'SVG', 'WebP'],
      maxSize: "50MB",
      categories: [
        { id: 'photography', name: 'Photography', subcategories: [
          { id: 'portrait', name: 'Portrait' },
          { id: 'landscape', name: 'Landscape' },
          { id: 'street', name: 'Street' },
        ]},
        { id: 'graphic', name: 'Graphic Design', subcategories: [
          { id: 'illustration', name: 'Illustration' },
          { id: 'typography', name: 'Typography' },
        ]},
      ],
      destination: "Images Gallery"
    },
    document: {
      id: "document",
      name: "Document",
      icon: FileText,
      description: "Upload your documents, articles, presentations, and written content.",
      acceptedTypes: ".pdf,.doc,.docx,.txt,.ppt,.pptx,.odt",
      supportedFormats: ['PDF', 'DOC', 'DOCX', 'TXT', 'PPT', 'PPTX'],
      maxSize: "500MB",
      categories: [
        { id: 'academic', name: 'Academic', subcategories: [
          { id: 'research', name: 'Research Paper' },
          { id: 'thesis', name: 'Thesis' },
        ]},
        { id: 'business', name: 'Business', subcategories: [
          { id: 'presentation', name: 'Presentation' },
          { id: 'report', name: 'Report' },
        ]},
      ],
      destination: "Documents Library"
    },
  };
  
  const currentContentType = contentTypes[selectedContentType];
  
  const handleContentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContentType(e.target.value);
  };
  
  const handleUpload = (files: File[], title: string, description: string, category?: string, subcategory?: string, tags?: string[]) => {
    console.log(`${currentContentType.name} upload initiated:`, files, "Title:", title, "Description:", description, "Category:", category, "Subcategory:", subcategory, "Tags:", tags);
    
    toast({
      title: `${currentContentType.name} upload started`,
      description: `Processing ${files.length} ${files.length === 1 ? 'file' : 'files'} ${category ? `in category: ${category}` : ''}${subcategory ? `, subcategory: ${subcategory}` : ''}`,
    });
    
    if (selectedContentType === 'video' || selectedContentType === 'shorts') {
      files.forEach(file => {
        addUploadedVideo(file, title || file.name, description || '', category, subcategory, tags);
      });
    }
    
    setTimeout(() => {
      let redirectPath = '/';
      
      if (selectedContentType === 'shorts') redirectPath = '/shorts';
      else if (selectedContentType === 'music') redirectPath = '/music';
      else if (selectedContentType === 'image') redirectPath = '/images';
      else if (selectedContentType === 'document') redirectPath = '/documents';
      
      toast({
        title: "Upload complete",
        description: `Your ${currentContentType.name.toLowerCase()} has been processed and is now available.`,
        action: (
          <ToastAction altText={`Go to ${redirectPath === '/' ? 'home' : redirectPath.substring(1)} page`} onClick={() => navigate(redirectPath)}>
            View {redirectPath === '/' ? 'Home' : redirectPath.substring(1)}
          </ToastAction>
        )
      });
      
      navigate(redirectPath);
    }, 2000);
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <div className="flex items-center gap-3 mb-8">
          <UploadIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Universal Upload</h1>
          <p className="text-muted-foreground ml-2">
            Upload any type of content to MiyTube
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Select Content Type</h2>
            <select 
              className="p-2 rounded-md border bg-background flex-grow max-w-xs"
              value={selectedContentType}
              onChange={handleContentTypeChange}
            >
              {Object.values(contentTypes).map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.values(contentTypes).map(type => (
              <div 
                key={type.id} 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedContentType === type.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-transparent hover:border-muted-foreground/30'
                }`}
                onClick={() => setSelectedContentType(type.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <type.icon size={24} className={selectedContentType === type.id ? 'text-primary' : 'text-muted-foreground'} />
                  <h3 className="font-medium">{type.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <FileUploader
          icon={currentContentType.icon}
          title={`Upload ${currentContentType.name}`}
          description={currentContentType.description}
          acceptedTypes={currentContentType.acceptedTypes}
          supportedFormats={currentContentType.supportedFormats}
          maxSize={currentContentType.maxSize}
          onUpload={handleUpload}
          id={`${currentContentType.id}-upload-input`}
          uploadDestination={currentContentType.destination}
          categories={currentContentType.categories}
        />
        
        {selectedContentType === 'video' && (
          <UploadRequirements 
            videoFormats={contentTypes.video.supportedFormats}
            audioFormats={contentTypes.music.supportedFormats}
          />
        )}
        
        {selectedContentType === 'music' && (
          <MusicUploadRequirements 
            audioFormats={contentTypes.music.supportedFormats}
          />
        )}
      </div>
    </Layout>
  );
};

export default Upload;
