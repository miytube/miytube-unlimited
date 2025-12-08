
import React from 'react';
import { Layout } from '@/components/Layout';
import { Mic, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosBySubcategory } from '@/utils/videoFiltering';
import VideoContent from '@/components/subcategory/VideoContent';

const HollywoodInterviews = () => {
  const { uploadedVideos } = useUploadedVideos();
  const videos = filterVideosBySubcategory(uploadedVideos, 'Interviews & Work', 'hollywood-interviews');

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Mic className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">
              <Link to="/hollywood" className="hover:text-primary">MiyTube / Hollywood</Link> / Interviews & Work
            </p>
            <h1 className="text-3xl font-bold">Actors & Actress: Interviews & Work</h1>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Interviews and behind-the-scenes work of Hollywood talent
        </p>

        {videos.length > 0 ? (
          <VideoContent 
            title="Interviews & Work Videos" 
            videos={videos.map(v => ({
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
            <Mic className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Interviews & Work Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload Hollywood interviews!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Content</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HollywoodInterviews;
