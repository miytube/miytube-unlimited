import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Users, Globe, Shield, BarChart3, Megaphone, CheckCircle2, Download } from 'lucide-react';
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
const MediaKit = () => {
  return (
    <Layout>
      <Helmet>
        <title>Advertise on MiyTube — Media Kit for Brands & Agencies</title>
        <meta name="description" content="MiyTube media kit: audience, ad formats, rate card, brand-safety standards, and contact for direct brand advertisers and agencies." />
        <link rel="canonical" href="https://miytube.com/media-kit" />
      </Helmet>

      <div className="py-8 animate-fade-in w-full max-w-[1200px] mx-auto px-4">
        {/* Hero */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Megaphone className="h-4 w-4" /> For Brands & Agencies
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Advertise on MiyTube</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reach an engaged global audience watching music, sports, news, entertainment, and educational
            video — across regular videos and shorts — in a brand-safe environment.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Button asChild size="lg">
              <a href="mailto:ads@miytube.com?subject=MiyTube%20Advertising%20Inquiry">
                <Mail className="h-4 w-4 mr-2" /> Contact Sales
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#rate-card">View Rate Card</a>
            </Button>
          </div>
        </section>

        {/* Audience snapshot */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Audience Snapshot
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Years live', value: '4+' },
              { label: 'Content categories', value: '100+' },
              { label: 'Avg. session', value: 'Engaged' },
              { label: 'Primary geo', value: 'US / Global' },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="p-5 text-center">
                  <div className="text-2xl font-bold text-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Detailed monthly traffic, demographics, and Google Analytics 4 reports available on request under NDA.
            Email <a href="mailto:ads@miytube.com" className="text-primary underline">ads@miytube.com</a>.
          </p>
        </section>

        {/* Audience interests */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Content Verticals</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Music & Music Videos', 'Sports (NFL, Boxing, Isle of Man TT)', 'News & Politics',
              'Hollywood & Entertainment', 'Educational', 'Travel & Events', 'Autos & Vehicles',
              'Pets & Animals', 'Real Estate', 'Health & Fitness', 'Talk & Reality Shows',
              'Military', 'Engineering & Disasters', 'Family',
            ].map(v => (
              <span key={v} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                {v}
              </span>
            ))}
          </div>
        </section>

        {/* Ad Formats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Ad Placements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Pre-roll Video Ads', desc: 'VAST-compatible video ads (skippable & non-skippable) before regular videos.', size: '15s / 30s' },
              { name: 'Bumper Ads', desc: 'Non-skippable 6-second ads for high-recall brand messaging.', size: '6s' },
              { name: 'Display Banner — Leaderboard', desc: 'Top of category and watch pages.', size: '728×90 / 970×250' },
              { name: 'Display Banner — Medium Rectangle', desc: 'Sidebar and in-feed placements.', size: '300×250' },
              { name: 'Half-Page Unit', desc: 'High-viewability sidebar placement.', size: '300×600' },
              { name: 'Homepage Takeover', desc: 'Premium hero placement on miytube.com homepage.', size: 'Custom' },
              { name: 'Sponsored Content / Featured Video', desc: 'Branded video featured in category feeds.', size: 'Native' },
              { name: 'Newsletter / Breaking News Ticker', desc: 'Sponsored mention in breaking-news ticker.', size: 'Text' },
            ].map(f => (
              <Card key={f.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {f.name}
                    <span className="text-xs font-normal text-muted-foreground">{f.size}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Rate Card */}
        <section id="rate-card" className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Indicative Rate Card
          </h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-3">Placement</th>
                  <th className="text-left p-3">Pricing Model</th>
                  <th className="text-left p-3">Starting Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['Pre-roll Video (Skippable)', 'CPM', '$15'],
                  ['Pre-roll Video (Non-skip / Bumper)', 'CPM', '$25'],
                  ['Display Banner (728×90 / 300×250)', 'CPM', '$5'],
                  ['Half-Page (300×600)', 'CPM', '$8'],
                  ['Sponsored / Featured Video', 'Flat (7 days)', '$1,500'],
                  ['Homepage Takeover', 'Flat (24 hours)', '$2,500'],
                  ['Custom Campaign / Integration', 'Negotiated', 'Contact us'],
                ].map(row => (
                  <tr key={row[0]}>
                    <td className="p-3">{row[0]}</td>
                    <td className="p-3 text-muted-foreground">{row[1]}</td>
                    <td className="p-3 font-medium">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Rates are starting points and vary by targeting, volume, and seasonality. Volume discounts available
            for commitments over $10,000. All campaigns subject to MiyTube ad policy review.
          </p>
        </section>

        {/* Brand Safety */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" /> Brand Safety & Standards
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Active content moderation and community guidelines enforcement',
              'IAB-aligned content categorization (Entertainment, Music, Sports, News, Education)',
              'No adult, hateful, or graphic violent content',
              'HTTPS-only, mobile-responsive, fast-loading pages',
              'IAB-standard ad sizes and VAST video tag support',
              'Third-party ad-tag serving (Google Ad Manager, DoubleVerify, IAS compatible)',
              'ads.txt published and authorized sellers list maintained',
              'GDPR / CCPA compliant privacy policy',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-lg bg-card border">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Specs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" /> Technical Specifications
          </h2>
          <Card>
            <CardContent className="p-6 space-y-2 text-sm">
              <p><strong>Display:</strong> JPG, PNG, GIF, HTML5 — max 200KB</p>
              <p><strong>Video:</strong> MP4 (H.264) or VAST 2.0+ / VPAID 2.0 tag</p>
              <p><strong>Video specs:</strong> 16:9, 1920×1080 or 1280×720, max 30s, ≤30MB</p>
              <p><strong>Third-party tags:</strong> Google Ad Manager, Sizmek, Flashtalking, Innovid supported</p>
              <p><strong>Tracking:</strong> Click trackers, impression pixels, viewability (IAS / DoubleVerify) supported</p>
              <p><strong>Lead time:</strong> 5 business days from creative receipt to launch</p>
            </CardContent>
          </Card>
        </section>

        {/* Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How to Get Started</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { n: 1, t: 'Inquire', d: 'Email us with your campaign goals, budget, and timeline.' },
              { n: 2, t: 'Proposal', d: 'We send a tailored media plan and full audience report under NDA.' },
              { n: 3, t: 'Creative & Tags', d: 'You provide creative or third-party tags; we QA and traffic.' },
              { n: 4, t: 'Launch & Report', d: 'Campaign goes live with weekly performance reporting.' },
            ].map(s => (
              <Card key={s.n}>
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mb-3">{s.n}</div>
                  <h3 className="font-semibold mb-1">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-card border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Talk?</h2>
          <p className="text-muted-foreground mb-6">
            Send us your brief and we'll respond within 1 business day with a custom proposal.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg">
              <a href="mailto:ads@miytube.com?subject=MiyTube%20Advertising%20Inquiry">
                <Mail className="h-4 w-4 mr-2" /> ads@miytube.com
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/advertising">
                <Download className="h-4 w-4 mr-2" /> Self-Serve Ad Platform
              </a>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MediaKit;
