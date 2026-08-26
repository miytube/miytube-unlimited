import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Trophy, Newspaper, Music2, Radio, MessageCircle } from 'lucide-react';

const COMMUNITIES = [
  { to: '/category/gmatrader', label: 'GmaTrader', blurb: 'Nasdaq futures, markets', Icon: LineChart },
  { to: '/high-school-sports', label: 'High School Sports', blurb: 'CIF games & playoffs', Icon: Trophy },
  { to: '/breaking-news', label: 'Breaking News', blurb: 'What just happened', Icon: Newspaper },
  { to: '/music', label: 'Music', blurb: 'Videos, genres, live sets', Icon: Music2 },
  { to: '/podcasts', label: 'Podcasts', blurb: 'Talk, news, gossip', Icon: Radio },
  { to: '/miytube-at-cha', label: 'MiyTube At Cha', blurb: 'AI chat rooms', Icon: MessageCircle },
];

/** Focused communities — the reason to come back, versus a generic feed. */
export const CommunityStrip: React.FC = () => (
  <section className="mb-8">
    <h2 className="text-xl font-medium mb-3">Where people hang out</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {COMMUNITIES.map(({ to, label, blurb, Icon }) => (
        <Link
          key={to}
          to={to}
          className="group rounded-lg border bg-card p-3 transition-colors hover:border-primary/60 hover:bg-primary/5"
        >
          <Icon size={18} className="text-primary" />
          <p className="mt-2 text-sm font-medium leading-tight">{label}</p>
          <p className="text-xs text-muted-foreground leading-tight">{blurb}</p>
        </Link>
      ))}
    </div>
  </section>
);
