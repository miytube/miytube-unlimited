import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Armchair, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export interface RoomActivity { visitorsThisWeek: number; visitsThisWeek: number; inRoomNow: number }

export const useRoomActivity = () => {
  const [activity, setActivity] = useState<RoomActivity | null>(null);
  useEffect(() => {
    supabase.functions.invoke('the-room-activity', { method: 'GET' })
      .then(({ data }) => { if (data && typeof data.visitorsThisWeek === 'number') setActivity(data); })
      .catch(() => {});
  }, []);
  return activity;
};

/** Live social-proof line: who's in The Room now and this week. */
export const RoomActivityLine: React.FC<{ activity: RoomActivity | null }> = ({ activity }) => {
  if (!activity || activity.visitorsThisWeek === 0) return null;
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      {activity.inRoomNow > 0 && (
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {activity.inRoomNow} in The Room now ·
        </span>
      )}
      <Users className="h-4 w-4" />
      {activity.visitorsThisWeek.toLocaleString()} people visited this week
    </p>
  );
};

/** Watch-page sidebar card inviting viewers into The Room. */
export const RoomActivityCard: React.FC = () => {
  const activity = useRoomActivity();
  return (
    <div className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Armchair className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">The Room</h3>
      </div>
      <p className="text-sm">You name the topic. We build the room.</p>
      <RoomActivityLine activity={activity} />
      <Button asChild size="sm" className="w-full">
        <Link to="/the-room">Step into The Room</Link>
      </Button>
    </div>
  );
};
