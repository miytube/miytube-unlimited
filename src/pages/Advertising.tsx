import React from 'react';
import { Layout } from '@/components/Layout';

const Advertising = () => {
  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">MiyTube Advertising</h1>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Advertise on MiyTube</h2>
          <p className="text-muted-foreground mb-6">
            Reach people on MiyTube who are discovering content that they're interested in, when they're ready to pay attention.
          </p>
          <button className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            Get Started
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary text-xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Create Your Campaign</h3>
            <p className="text-muted-foreground">
              Set up your campaign goals, target audience, and budget. Our tools make it easy to get started.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary text-xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Launch Your Ads</h3>
            <p className="text-muted-foreground">
              Choose from various ad formats including skippable in-stream ads, non-skippable in-stream ads, and video discovery ads.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary text-xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Measure Results</h3>
            <p className="text-muted-foreground">
              Track performance with detailed analytics and optimize your campaigns for better results.
            </p>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Ad Formats</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-24 h-16 bg-secondary rounded-lg flex-shrink-0"></div>
              <div>
                <h3 className="font-medium mb-1">Skippable In-stream Ads</h3>
                <p className="text-sm text-muted-foreground">
                  Play before, during, or after other videos. Viewers can skip after 5 seconds.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-24 h-16 bg-secondary rounded-lg flex-shrink-0"></div>
              <div>
                <h3 className="font-medium mb-1">Non-skippable In-stream Ads</h3>
                <p className="text-sm text-muted-foreground">
                  15-20 second ads that viewers must watch before their video.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-24 h-16 bg-secondary rounded-lg flex-shrink-0"></div>
              <div>
                <h3 className="font-medium mb-1">Bumper Ads</h3>
                <p className="text-sm text-muted-foreground">
                  Non-skippable 6-second ads that must be watched before a video.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-24 h-16 bg-secondary rounded-lg flex-shrink-0"></div>
              <div>
                <h3 className="font-medium mb-1">Discovery Ads</h3>
                <p className="text-sm text-muted-foreground">
                  Appear next to related videos, in search results, and on the homepage.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Ad Network Partnerships</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Google AdSense</h3>
              <p className="text-muted-foreground mb-4">
                MiyTube fully supports Google AdSense integration, allowing content creators to monetize their videos through targeted advertising. 
                Connect your AdSense account to start earning revenue from your content.
              </p>
              <button className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                Connect AdSense Account
              </button>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Microsoft/Bing Ads</h3>
              <p className="text-muted-foreground mb-4">
                MiyTube now supports Microsoft Advertising and Bing Ads integration. Leverage Microsoft's ad platform to monetize your content and
                reach a wider audience through the Microsoft Search Network.
              </p>
              <button className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                Connect Microsoft Ads Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Advertising;
