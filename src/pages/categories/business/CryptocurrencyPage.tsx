
import React from 'react';
import { Layout } from '@/components/Layout';
import { Upload, Bitcoin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const CryptocurrencyPage = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  // Filter for crypto-related videos
  const cryptoKeywords = ['crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'nft', 'defi'];
  const cryptoVideos = uploadedVideos.filter(video => {
    const category = video.category?.toLowerCase() || '';
    const subcategory = video.subcategory?.toLowerCase() || '';
    const tags = video.tags?.map(t => t.toLowerCase()) || [];
    
    return cryptoKeywords.some(keyword => 
      category.includes(keyword) || 
      subcategory.includes(keyword) ||
      tags.some(tag => tag.includes(keyword))
    );
  });

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">MiyTube</span>
          <ChevronRight size={14} />
          <Link to="/business" className="hover:text-primary">Business</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Cryptocurrency</span>
        </div>
        
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Bitcoin className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Cryptocurrency</h1>
            <p className="text-muted-foreground ml-2">
              Bitcoin, blockchain, and digital currencies
            </p>
          </div>
          <Link 
            to="/upload" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Crypto Content</span>
          </Link>
        </div>
        
        {cryptoVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Cryptocurrency Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cryptoVideos.slice(0, 20).map((video) => (
                <VideoCard 
                  key={video.id} 
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelName="Your Channel"
                  views={video.views}
                  timestamp={video.timestamp}
                  duration={video.duration}
                  description={video.description}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <Bitcoin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Cryptocurrency Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload crypto content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Crypto Content</span>
            </Link>
          </div>
        )}
        
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About Cryptocurrency</h2>
          <p className="text-muted-foreground">
            This category features content related to cryptocurrencies like Bitcoin, Ethereum, and other blockchain technologies.
            Explore videos, tutorials, and analysis from experts in this rapidly evolving field.
            If you're a content creator in this space, consider uploading your own cryptocurrency content.
          </p>
          <div className="mt-4">
            <Link to="/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <Upload size={18} />
              <span>Upload Cryptocurrency Content</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CryptocurrencyPage;
