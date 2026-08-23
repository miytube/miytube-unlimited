import React from 'react';
import { Layout } from '@/components/Layout';
import { usePageSEO } from '@/hooks/usePageSEO';
import PartnerApplicationForm from '@/components/partner/PartnerApplicationForm';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DollarSign, Sparkles, Users, Wallet, TrendingUp, Video, Gift, CreditCard } from 'lucide-react';

const Monetization = () => {
  usePageSEO({
    title: 'Make Money on MiyTube — Creator Monetization',
    description: 'Earn money on MiyTube by uploading videos, receiving direct tips, turning videos into articles with AI, and joining the Partner Program.',
    path: '/monetization',
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Make money doing what you love</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            MiyTube gives creators more ways to earn than traditional platforms. Upload your videos, build your audience, and keep more of your revenue.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link to="/upload">Upload your first video</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth">Create a free account</Link>
            </Button>
          </div>
        </div>

        {/* Revenue streams */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-5 rounded-lg border bg-card hover:border-primary/50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
              <Gift size={20} />
            </div>
            <h3 className="font-semibold mb-2">Direct Tips</h3>
            <p className="text-sm text-muted-foreground">
              Viewers can tip you directly from any video, channel, or article page — writers earn too. 100% goes to your connected payment account.
            </p>

          </div>

          <div className="p-5 rounded-lg border bg-card hover:border-primary/50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="font-semibold mb-2">AI Video-to-Article</h3>
            <p className="text-sm text-muted-foreground">
              Turn your videos into SEO-friendly articles automatically. More indexed content means more traffic and more earning potential.
            </p>
          </div>

          <div className="p-5 rounded-lg border bg-card hover:border-primary/50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-semibold mb-2">Ad Revenue</h3>
            <p className="text-sm text-muted-foreground">
              Join the Partner Program to earn from ads shown on your long-form videos and channel pages.
            </p>
          </div>

          <div className="p-5 rounded-lg border bg-card hover:border-primary/50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
              <CreditCard size={20} />
            </div>
            <h3 className="font-semibold mb-2">Brand Deals</h3>
            <p className="text-sm text-muted-foreground">
              Advertisers can run targeted banner and pre-roll campaigns on your content. Eligible creators get a revenue share.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Partner Application Form */}
          <PartnerApplicationForm />

          {/* Eligibility + how it works */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Partner Program Requirements</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Direct tips and AI articles are available to everyone right away. The Partner Program unlocks ad revenue sharing.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">1</div>
                  <div>
                    <p className="font-medium">1,000 subscribers</p>
                    <p className="text-sm text-muted-foreground">Build your audience and reach 1,000 subscribers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">2</div>
                  <div>
                    <p className="font-medium">4,000 watch hours</p>
                    <p className="text-sm text-muted-foreground">Accumulate 4,000 hours of watch time in the past 12 months</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">3</div>
                  <div>
                    <p className="font-medium">Follow all policies</p>
                    <p className="text-sm text-muted-foreground">Adhere to MiyTube's community guidelines and terms of service</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">How payments work</h2>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Wallet size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Connect your Stripe account in settings to receive tips and payouts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Viewers see a Tip button on your videos and channel page.</span>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Tips and Partner payouts are deposited directly to your bank account.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Video size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Use the AI Video-to-Article button on your own videos to generate blog posts.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* FAQ / trust */}
        <div className="bg-muted/50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Why creators choose MiyTube</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-medium mb-1">Keep your revenue</h3>
              <p className="text-muted-foreground">Direct tips go straight to your payment account with no platform cut.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">More content, less work</h3>
              <p className="text-muted-foreground">One video becomes a blog post, social clips, and searchable articles automatically.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Own your audience</h3>
              <p className="text-muted-foreground">Your channel, your subscribers, your direct relationship with fans.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Monetization;
