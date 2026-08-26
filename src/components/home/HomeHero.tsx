import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DollarSign, Sparkles, Users } from 'lucide-react';

interface HomeHeroProps {
  siteName: string;
}

/**
 * Homepage positioning block.
 *
 * MiyTube does not win by being another generic video feed — it wins on
 * creator payouts and focused communities. The hero leads with that.
 */
export const HomeHero: React.FC<HomeHeroProps> = ({ siteName }) => (
  <section className="mb-8 overflow-hidden rounded-xl border bg-gradient-to-br from-primary/15 via-primary/5 to-background p-6 md:p-8">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      We Got Your Snapshot
    </p>
    <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
      Post your video. Get paid by the people who watch it.
    </h1>
    <p className="mt-3 text-muted-foreground max-w-2xl">
      {siteName} is built for creators the big platforms overlook: direct tips from viewers,
      AI that turns every upload into a searchable article, and real communities instead of
      an endless scroll.
    </p>

    <div className="mt-5 flex flex-wrap items-center gap-3">
      <Button asChild size="lg">
        <Link to="/upload">Start uploading</Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link to="/monetization">How creators get paid</Link>
      </Button>
      <Button asChild variant="ghost" size="lg">
        <Link to="/advertising">Advertise here</Link>
      </Button>
    </div>

    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users size={16} className="text-primary" />
        <span>Direct tips from fans — no subscription wall</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Sparkles size={16} className="text-primary" />
        <span>AI turns your video into an article</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <DollarSign size={16} className="text-primary" />
        <span>Ad revenue and partner perks</span>
      </div>
    </div>
  </section>
);
