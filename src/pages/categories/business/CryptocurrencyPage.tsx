
import React from 'react';
import { Layout } from '@/components/Layout';
import { BarChart, Upload, Bitcoin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';

const CryptocurrencyPage = () => {
  // Sample videos for demo purposes
  const cryptoVideos = [
    {
      id: 'crypto-1',
      title: 'Bitcoin: The Future of Money',
      thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80',
      channelName: 'Crypto Academy',
      views: '1.5M',
      timestamp: '2 days ago',
      duration: '18:22',
    },
    {
      id: 'crypto-2',
      title: 'Ethereum vs. Bitcoin: What You Need to Know',
      thumbnail: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&w=800&q=80',
      channelName: 'Crypto Insights',
      views: '956K',
      timestamp: '1 week ago',
      duration: '26:15',
    },
    {
      id: 'crypto-3',
      title: 'Cryptocurrency for Beginners',
      thumbnail: 'https://images.unsplash.com/photo-1523759533935-e4b770303b1d?auto=format&fit=crop&w=800&q=80',
      channelName: 'Finance Guru',
      views: '3.2M',
      timestamp: '3 months ago',
      duration: '22:42',
    },
    {
      id: 'crypto-4',
      title: 'The Future of Cryptocurrency',
      thumbnail: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=800&q=80',
      channelName: 'Future Tech',
      views: '2.7M',
      timestamp: '2 months ago',
      duration: '15:38',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Link to="/business" className="hover:text-primary">
            Business
          </Link>
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
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Cryptocurrency Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cryptoVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Popular in Cryptocurrency</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cryptoVideos.map((video, index) => ({
              ...video,
              id: `popular-${index}`,
              title: `Popular Crypto Content - ${index + 1}`,
            })).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
        
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
