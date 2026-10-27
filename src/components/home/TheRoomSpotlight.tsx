import React from 'react';
import { Link } from 'react-router-dom';
import { MonitorPlay, Mic, LayoutGrid, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomActivityLine, useRoomActivity } from '@/components/the-room/RoomActivityCard';

/** Homepage spotlight that sends visitors into The Room. */
export const TheRoomSpotlight: React.FC = () => {
  const activity = useRoomActivity();
  return (
    <section className="mb-8 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-5 md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <MonitorPlay size={14} /> New on MiyTube
          </p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">The Room</h2>
          <p className="mt-1 text-lg text-foreground/90">You name the topic. We build the room.</p>
          <div className="mt-2"><RoomActivityLine activity={activity} /></div>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="flex items-center gap-2"><MessageSquare size={16} className="text-primary" /> Live AI host</li>
            <li className="flex items-center gap-2"><LayoutGrid size={16} className="text-primary" /> Instant media canvas</li>
            <li className="flex items-center gap-2"><Mic size={16} className="text-primary" /> Talk by voice</li>
          </ul>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link to="/the-room">Enter The Room</Link>
        </Button>
      </div>
    </section>
  );
};
