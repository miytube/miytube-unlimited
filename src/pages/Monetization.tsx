
import React from 'react';
import { Layout } from '@/components/Layout';

const Monetization = () => {
  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">MiyTube Monetization</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Partner Program</h2>
            <p className="text-muted-foreground mb-4">
              Join the MiyTube Partner Program and earn revenue from your content through various monetization features.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Ad revenue sharing</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Channel memberships</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Super Chat & Super Stickers</span>
              </li>
            </ul>
            <button className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
              Apply Now
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Eligibility Requirements</h2>
            <p className="text-muted-foreground mb-4">
              To join the MiyTube Partner Program, you need to meet the following requirements:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium">1,000 subscribers</p>
                  <p className="text-sm text-muted-foreground">Build your audience and reach 1,000 subscribers</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium">4,000 watch hours</p>
                  <p className="text-sm text-muted-foreground">Accumulate 4,000 hours of watch time in the past 12 months</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-medium">Follow all policies</p>
                  <p className="text-sm text-muted-foreground">Adhere to MiyTube's community guidelines and terms of service</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Revenue Streams</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 border rounded-lg">
              <h3 className="font-medium mb-2">Google Ad Revenue</h3>
              <p className="text-sm text-muted-foreground">Earn from Google ads displayed on your videos</p>
            </div>
            <div className="p-5 border rounded-lg">
              <h3 className="font-medium mb-2">Microsoft/Bing Ads</h3>
              <p className="text-sm text-muted-foreground">Monetize through Microsoft's advertising network</p>
            </div>
            <div className="p-5 border rounded-lg">
              <h3 className="font-medium mb-2">Channel Memberships</h3>
              <p className="text-sm text-muted-foreground">Viewers pay a monthly fee for exclusive perks</p>
            </div>
            <div className="p-5 border rounded-lg">
              <h3 className="font-medium mb-2">Super Chat</h3>
              <p className="text-sm text-muted-foreground">Fans pay to highlight their messages in chat</p>
            </div>
            <div className="p-5 border rounded-lg">
              <h3 className="font-medium mb-2">Merchandise Shelf</h3>
              <p className="text-sm text-muted-foreground">Sell branded merchandise to your audience</p>
            </div>
            <div className="p-5 border rounded-lg">
              <h3 className="font-medium mb-2">MiyTube Premium Revenue</h3>
              <p className="text-sm text-muted-foreground">Earn from Premium subscribers who watch your content</p>
            </div>
            <div className="p-5 border rounded-lg">
              <h3 className="font-medium mb-2">Super Thanks</h3>
              <p className="text-sm text-muted-foreground">Fans can purchase Super Thanks to show support</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Monetization;
