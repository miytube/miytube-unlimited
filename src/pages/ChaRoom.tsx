import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import { usePageSEO } from '@/hooks/usePageSEO';
import chaLogo from '@/assets/cha-logo.png';

interface RoomMessage {
  id: string;
  author_name: string;
  role: string;
  content: string;
  created_at: string;
  user_id: string | null;
}

const ChaRoom: React.FC = () => {
  const { roomId: slug } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [room, setRoom] = useState<{ id: string; name: string; emoji: string; topic: string | null } | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [chaThinking, setChaThinking] = useState(false);

  usePageSEO({
    title: room ? `${room.name} — Group Cha` : 'Group Cha',
    description: 'A live MiyTube group room where members chat together and Cha, our AI, joins in.',
    path: `/cha-rooms/${slug ?? ''}`,
  });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const load = async () => {
      const { data: roomRow } = await supabase
        .from('cha_rooms')
        .select('id, name, emoji, topic')
        .eq('slug', slug)
        .eq('site', getCurrentSiteId())
        .eq('is_active', true)
        .maybeSingle();
      if (cancelled || !roomRow) {
        if (!cancelled) setRoom(null);
        return;
      }
      setRoom(roomRow);

      const { data: rows } = await supabase
        .from('cha_room_messages')
        .select('id, author_name, role, content, created_at, user_id')
        .eq('room_id', roomRow.id)
        .order('created_at', { ascending: true })
        .limit(200);
      if (!cancelled) setMessages(rows ?? []);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!room) return;
    const channel = supabase
      .channel(`cha-room-${room.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cha_room_messages', filter: `room_id=eq.${room.id}` },
        (payload) => {
          const next = payload.new as RoomMessage;
          setMessages((prev) => (prev.some((m) => m.id === next.id) ? prev : [...prev, next]));
          if (next.role === 'assistant') setChaThinking(false);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chaThinking]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || !room || sending) return;
    if (!user) {
      toast({ title: 'Sign in to join the room', variant: 'destructive' });
      return;
    }
    setSending(true);
    setInput('');

    const authorName =
      (user.user_metadata?.channel_name as string | undefined) || user.email?.split('@')[0] || 'Member';

    const { error } = await supabase.from('cha_room_messages').insert({
      room_id: room.id,
      user_id: user.id,
      author_name: authorName,
      role: 'user',
      content: text.slice(0, 2000),
    });
    setSending(false);
    inputRef.current?.focus();

    if (error) {
      toast({ title: 'Message not sent', description: error.message, variant: 'destructive' });
      return;
    }

    setChaThinking(true);
    const { error: replyError } = await supabase.functions.invoke('cha-room-reply', {
      body: { roomId: room.id },
    });
    if (replyError) {
      setChaThinking(false);
      console.error('Cha reply failed', replyError);
    }
  }, [input, room, sending, toast, user]);

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-3xl flex-col py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 w-fit gap-2 text-muted-foreground">
          <Link to="/cha-rooms">
            <ArrowLeft className="h-4 w-4" />
            All rooms
          </Link>
        </Button>

        {!room ? (
          <p className="text-muted-foreground">This room is not available.</p>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-border pb-4">
              <span className="text-2xl" aria-hidden="true">
                {room.emoji}
              </span>
              <div>
                <h1 className="text-xl font-semibold">{room.name}</h1>
                <p className="text-sm text-muted-foreground">{room.topic ?? 'Open chat'}</p>
              </div>
            </header>

            <div className="flex min-h-[45vh] flex-col gap-4 overflow-y-auto py-6">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">No one has said anything yet. Go first.</p>
              )}
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  {message.role === 'assistant' ? (
                    <img
                      src={chaLogo}
                      alt="Cha"
                      loading="lazy"
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-muted-foreground">
                      {message.author_name.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{message.author_name}</p>
                    <p className="whitespace-pre-wrap text-sm text-foreground">{message.content}</p>
                  </div>
                </div>
              ))}
              {chaThinking && <p className="text-sm text-muted-foreground">Cha is typing...</p>}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-border pt-4"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={user ? 'say something to the room...' : 'sign in to join the room'}
                className="rounded-full"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || sending} className="rounded-full">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ChaRoom;
