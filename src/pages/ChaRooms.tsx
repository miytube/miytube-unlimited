import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import { usePageSEO } from '@/hooks/usePageSEO';

interface ChaRoom {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  description: string | null;
  topic: string | null;
}

const ChaRooms: React.FC = () => {
  const [rooms, setRooms] = useState<ChaRoom[]>([]);
  const [loading, setLoading] = useState(true);

  usePageSEO({
    title: 'Group Cha — live rooms with MiyTube\u2019s AI',
    description: 'Jump into a live MiyTube group room. Chat with other members while Cha, our AI, joins in.',
    path: '/cha-rooms',
  });

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('cha_rooms')
        .select('id, slug, name, emoji, description, topic')
        .eq('site', getCurrentSiteId())
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) console.error('Failed to load rooms', error);
      setRooms(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="mx-auto w-full max-w-4xl py-10">
        <Button asChild variant="ghost" size="sm" className="mb-4 gap-2 text-muted-foreground">
          <Link to="/talk-at-cha">
            <ArrowLeft className="h-4 w-4" />
            Back to Cha
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Group Cha</h1>
        <p className="mt-2 text-muted-foreground">
          Live rooms. Talk with other MiyTube members — Cha jumps in too.
        </p>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading rooms...</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {rooms.map((room) => (
              <Link key={room.id} to={`/cha-rooms/${room.slug}`}>
                <Card className="h-full p-5 transition-colors hover:bg-accent">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {room.emoji}
                    </span>
                    <div>
                      <h2 className="font-semibold">{room.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {room.description ?? room.topic ?? 'Open chat'}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChaRooms;
