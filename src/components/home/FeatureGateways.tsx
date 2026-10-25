import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, DollarSign, MessageSquareText, ArrowRight } from 'lucide-react';
import { gaEvent } from '@/lib/ga';

type Gateway = 'creator' | 'room' | 'booksem';

const trackGatewayClick = (gateway: Gateway) => {
  gaEvent('gateway_click', {
    content_type: 'home_gateway',
    item_id: gateway,
  });
};

const cards: {
  gateway: Gateway;
  badge: string;
  title: string;
  copy: string;
  cta: string;
  icon: React.ReactNode;
  to?: string;
  href?: string;
}[] = [
  {
    gateway: 'creator',
    badge: 'For Creators',
    title: 'Earn on MiyTube',
    copy: 'Upload your content, receive direct viewer tips, and earn through the Partner Program.',
    cta: 'Start uploading',
    icon: <DollarSign size={18} />,
    to: '/monetization',
  },
  {
    gateway: 'room',
    badge: 'Live AI Conversations',
    title: 'Enter The Room',
    copy: 'Name any topic and an AI host builds the room — talk by voice, share media, discuss in real time.',
    cta: 'Enter The Room',
    icon: <MessageSquareText size={18} />,
    to: '/the-room',
  },
  {
    gateway: 'booksem',
    badge: 'Sister Network',
    title: 'Read & Listen on Booksem',
    copy: 'Our reading platform partners with MiyTube — books, audiobooks, and live author interviews.',
    cta: 'Explore Booksem',
    icon: <BookOpen size={18} />,
    href: 'https://booksem.com',
  },
];

/**
 * Homepage 3-pillar gateway bar: creator monetization, The Room, and Booksem.
 * Every card click is tracked so we can see which pillars visitors choose.
 */
export const FeatureGateways: React.FC = () => (
  <section className="mb-8 grid gap-3 md:grid-cols-3" aria-label="MiyTube highlights">
    {cards.map((card) => {
      const inner = (
        <>
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              {card.icon}
              {card.badge}
            </p>
            <ArrowRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
          <h2 className="mt-2.5 text-base font-semibold">{card.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{card.copy}</p>
          <span className="mt-3 inline-block text-sm font-medium text-primary">{card.cta}</span>
        </>
      );
      const className =
        'group block rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/50';
      return card.to ? (
        <Link
          key={card.gateway}
          to={card.to}
          className={className}
          onClick={() => trackGatewayClick(card.gateway)}
        >
          {inner}
        </Link>
      ) : (
        <a
          key={card.gateway}
          href={card.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={() => trackGatewayClick(card.gateway)}
        >
          {inner}
        </a>
      );
    })}
  </section>
);
