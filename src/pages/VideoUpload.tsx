
import React from 'react';
import { Layout } from '@/components/Layout';
import { FileUploader } from '@/components/FileUploader';
import { Film, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';

const VideoUpload = () => {
  const { toast } = useToast();
  
  const handleUpload = (files: File[]) => {
    console.log("Video upload initiated:", files);
    
    toast({
      title: "Video upload started",
      description: `Processing ${files.length} ${files.length === 1 ? 'video' : 'videos'}. This may take a few minutes.`,
    });
    
    // Simulate upload completion
    setTimeout(() => {
      toast({
        title: "Upload complete",
        description: "Your video has been processed and is now available in your library.",
      });
    }, 3000);
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Upload Video</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/long-videos" className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Film size={20} /> Long-Form Videos
            </h2>
            <p className="text-muted-foreground">
              Upload videos up to 10 hours in length. Perfect for lectures, tutorials, and documentaries.
            </p>
          </Link>
          
          <Link to="/shorts" className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Film size={20} /> Short Videos
            </h2>
            <p className="text-muted-foreground">
              Create catchy videos up to 60 seconds. Great for trends, quick tips, and creative moments.
            </p>
          </Link>
        </div>
        
        <FileUploader
          icon={Film}
          title="Quick Upload"
          description="Upload your video directly. Our system will automatically determine if it's a Short (under 60 seconds) or a standard video."
          acceptedTypes="video/*"
          supportedFormats={['MP4', 'MOV', 'WebM', 'AVI', 'FLV', 'MKV']}
          maxSize="128GB"
          onUpload={handleUpload}
          id="quick-upload-input"
          uploadDestination="Your Channel > Videos section"
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
                <p className="text-muted-foreground">Your video will be processed on our servers. This may take a few minutes.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="font-bold text-primary">2</span>
              </div>
              <div>
                <h3 className="font-medium">Edit Details</h3>
                <p className="text-muted-foreground">Add title, description, tags, and thumbnail to make your video discoverable.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="font-bold text-primary">3</span>
              </div>
              <div>
                <h3 className="font-medium">Publish</h3>
                <p className="text-muted-foreground">Choose when to publish your video - immediately, scheduled, or as a draft.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoUpload;
