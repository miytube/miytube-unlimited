import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import chaLogo from '@/assets/cha-logo.png';

const SUGGESTIONS = [
  'go on then, impress me',
  'i had the weirdest day',
  'roast my playlist',
  'help me say something hard',
];

const rowToMessage = (row: { id: string; role: string; parts: unknown }): UIMessage => ({
  id: row.id,
  role: row.role === 'assistant' ? 'assistant' : 'user',
  parts: (Array.isArray(row.parts) ? row.parts : []) as UIMessage['parts'],
});

export const ChaChat: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const composerRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState('');
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) {
        setInitialMessages([]);
        return;
      }
      const { data: conversation } = await supabase
        .from('cha_conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('site', getCurrentSiteId())
        .maybeSingle();

      if (!conversation) {
        if (!cancelled) setInitialMessages([]);
        return;
      }

      const { data: rows, error } = await supabase
        .from('cha_messages')
        .select('id, role, parts, created_at')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) console.error('Failed to load Cha history', error);
      if (!cancelled) setInitialMessages((rows ?? []).map(rowToMessage));
    };
    if (!authLoading) load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cha-chat`,
        headers: async () => {
          const { data } = await supabase.auth.getSession();
          return {
            Authorization: `Bearer ${
              data.session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
            }`,
          };
        },
        body: { site: getCurrentSiteId() },
      }),
    []
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    id: `cha-${user?.id ?? 'guest'}`,
    messages: initialMessages ?? [],
    transport,
    onError: (error) =>
      toast({
        title: 'Cha could not answer',
        description: error.message || 'Please try again in a moment.',
        variant: 'destructive',
      }),
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (!isBusy) composerRef.current?.querySelector('textarea')?.focus();
  }, [isBusy, initialMessages]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isBusy) return;
      if (!user) {
        toast({ title: 'Sign in to talk to Cha', description: 'Your chat is saved to your account.' });
        navigate('/auth');
        return;
      }
      setInput('');
      sendMessage({ text: trimmed });
    },
    [isBusy, navigate, sendMessage, toast, user]
  );

  const clearChat = async () => {
    if (!user) return;
    const { data: conversation } = await supabase
      .from('cha_conversations')
      .select('id')
      .eq('user_id', user.id)
      .eq('site', getCurrentSiteId())
      .maybeSingle();
    if (conversation) {
      const { error } = await supabase.from('cha_messages').delete().eq('conversation_id', conversation.id);
      if (error) {
        toast({ title: 'Could not clear chat', description: error.message, variant: 'destructive' });
        return;
      }
    }
    setMessages([]);
    toast({ title: 'Fresh start', description: 'Your conversation with Cha was cleared.' });
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {!hasMessages && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground/90 transition-colors hover:bg-accent"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {hasMessages && (
        <>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearChat} className="gap-2 text-muted-foreground">
              <RotateCcw className="h-4 w-4" />
              New chat
            </Button>
          </div>

          <Conversation className="min-h-[320px] max-h-[55vh] rounded-2xl border border-border bg-card/50">
            <ConversationContent className="gap-4">
              {messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  {message.role === 'assistant' && (
                    <img
                      src={chaLogo}
                      alt="Cha"
                      loading="lazy"
                      width={32}
                      height={32}
                      className="mt-1 h-8 w-8 shrink-0 rounded-full"
                    />
                  )}
                  <MessageContent>
                    {message.parts.map((part, index) =>
                      part.type === 'text' ? (
                        <MessageResponse key={`${message.id}-${index}`}>{part.text}</MessageResponse>
                      ) : null
                    )}
                  </MessageContent>
                </Message>
              ))}
              {status === 'submitted' && (
                <div className="pl-1">
                  <Shimmer>Cha is thinking...</Shimmer>
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </>
      )}

      <div ref={composerRef}>
      <PromptInput
        onSubmit={(_message, event) => {
          event.preventDefault();
          send(input);
        }}
        className="rounded-full"
      >
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="say something..."
        />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit status={status} disabled={!input.trim() && !isBusy} />
        </PromptInputFooter>
      </PromptInput>
      </div>
    </div>
  );
};
