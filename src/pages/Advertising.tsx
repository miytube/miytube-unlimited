import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { CreateAdForm } from '@/components/advertising/CreateAdForm';
import { MyCampaigns } from '@/components/advertising/MyCampaigns';
import { AdPricing } from '@/components/advertising/AdPricing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Megaphone, BarChart3, DollarSign, Plus, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Advertising = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">MiyTube Advertising</h1>
            </div>
            <p className="text-muted-foreground mt-1 ml-11">
              Reach millions of viewers with targeted ads on MiyTube
            </p>
          </div>
          {user && (
            <Button onClick={() => setActiveTab('create')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Campaign
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Pricing
            </TabsTrigger>
            {user && (
              <>
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Create Ad
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> My Campaigns
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="bg-card p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Advertise on MiyTube</h2>
              <p className="text-muted-foreground mb-6">
                Reach people on MiyTube who are discovering content that they're interested in, when they're ready to pay attention.
                Our self-serve ad platform makes it easy to create, launch, and track your advertising campaigns.
              </p>
              {!user ? (
                <Button onClick={() => navigate('/auth')} className="rounded-full">
                  Sign In to Get Started
                </Button>
              ) : (
                <Button onClick={() => setActiveTab('create')} className="rounded-full">
                  Create Your First Campaign
                </Button>
              )}
            </div>

            {/* How It Works */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Create Your Campaign</h3>
                <p className="text-muted-foreground">
                  Set up your campaign goals, choose your ad format, define your target audience, and set your budget.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Pay & Launch</h3>
                <p className="text-muted-foreground">
                  Complete payment and your ads will be reviewed. Once approved, they'll start running automatically.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Track & Optimize</h3>
                <p className="text-muted-foreground">
                  Monitor impressions, clicks, and CTR in real-time. Pause, resume, or adjust campaigns anytime.
                </p>
              </div>
            </div>

            {/* Ad Formats */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Ad Formats</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'Skippable In-stream Ads', desc: 'Play before, during, or after videos. Viewers can skip after 5 seconds.', color: 'bg-primary/20' },
                  { name: 'Non-skippable In-stream Ads', desc: '15-20 second ads that viewers must watch before their video.', color: 'bg-primary/30' },
                  { name: 'Bumper Ads', desc: 'Non-skippable 6-second ads that must be watched before a video.', color: 'bg-primary/15' },
                  { name: 'Discovery Ads', desc: 'Appear next to related videos, in search results, and on the homepage.', color: 'bg-primary/10' },
                  { name: 'Banner Ads', desc: 'Display banners shown on category pages and sidebars.', color: 'bg-primary/25' },
                  { name: 'Overlay Ads', desc: 'Semi-transparent overlays shown at the bottom of video players.', color: 'bg-primary/20' },
                ].map(format => (
                  <div key={format.name} className="flex gap-4 items-start">
                    <div className={`w-20 h-14 ${format.color} rounded-lg flex-shrink-0 flex items-center justify-center`}>
                      <Megaphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{format.name}</h3>
                      <p className="text-sm text-muted-foreground">{format.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Network Partnerships */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Ad Network Partnerships</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Google AdSense</h3>
                  <p className="text-muted-foreground mb-4">
                    MiyTube supports Google AdSense integration for content creators to monetize through targeted advertising.
                  </p>
                  <a href="https://www.google.com/adsense/start/" target="_blank" rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                    Connect AdSense
                  </a>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Microsoft/Bing Ads</h3>
                  <p className="text-muted-foreground mb-4">
                    Leverage Microsoft's ad platform to monetize content and reach a wider audience.
                  </p>
                  <a href="https://ads.microsoft.com/" target="_blank" rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                    Connect Microsoft Ads
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <AdPricing />
          </TabsContent>

          {/* Create Ad Tab */}
          <TabsContent value="create">
            {user ? (
              <div className="max-w-2xl">
                <CreateAdForm onSuccess={() => setActiveTab('campaigns')} />
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg">
                <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">Sign in to create ads</h3>
                <p className="text-sm text-muted-foreground mb-4">You need an account to create and manage ad campaigns.</p>
                <Button onClick={() => navigate('/auth')}>Sign In</Button>
              </div>
            )}
          </TabsContent>

          {/* My Campaigns Tab */}
          <TabsContent value="campaigns">
            {user ? (
              <MyCampaigns />
            ) : (
              <div className="text-center py-12 bg-card rounded-lg">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">Sign in to view campaigns</h3>
                <Button onClick={() => navigate('/auth')}>Sign In</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Advertising;
