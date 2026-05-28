import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useToast } from "@/hooks/use-toast";
import { Discussion } from '@/components/discussions/DiscussionCard';
import { NewDiscussionForm, NewPostFormData } from '@/components/discussions/NewDiscussionForm';
import { DiscussionControls } from '@/components/discussions/DiscussionControls';
import { DiscussionList } from '@/components/discussions/DiscussionList';
import { TalkAtChaHeader } from '@/components/discussions/TalkAtChaHeader';
import { FeaturedDiscussionVideo } from '@/components/discussions/FeaturedDiscussionVideo';
import { CATEGORIES } from '@/components/discussions/discussionConstants';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const formatTimestamp = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
};

const TalkAtCha = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostVisible, setNewPostVisible] = useState(false);
  const [category, setCategory] = useState('All Categories');
  const [newPost, setNewPost] = useState<NewPostFormData>({
    title: '',
    content: '',
    category: 'Politics',
  });

  const loadDiscussions = async () => {
    setLoading(true);
    const { data: posts, error } = await supabase
      .from('discussions')
      .select('id, category, title, content, author_name, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error loading discussions', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const ids = (posts ?? []).map((p) => p.id);
    let replyCounts: Record<string, number> = {};
    let likeCounts: Record<string, number> = {};

    if (ids.length) {
      const [{ data: replies }, { data: likes }] = await Promise.all([
        supabase.from('discussion_replies').select('discussion_id').in('discussion_id', ids),
        supabase.from('discussion_likes').select('discussion_id').in('discussion_id', ids),
      ]);
      (replies ?? []).forEach((r: any) => {
        replyCounts[r.discussion_id] = (replyCounts[r.discussion_id] ?? 0) + 1;
      });
      (likes ?? []).forEach((l: any) => {
        likeCounts[l.discussion_id] = (likeCounts[l.discussion_id] ?? 0) + 1;
      });
    }

    setDiscussions(
      (posts ?? []).map((p) => ({
        id: p.id,
        category: p.category,
        title: p.title,
        content: p.content,
        author: p.author_name,
        replies: replyCounts[p.id] ?? 0,
        likes: likeCounts[p.id] ?? 0,
        timestamp: formatTimestamp(p.created_at),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadDiscussions();
  }, []);

  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to post a discussion.',
      });
      navigate('/auth');
      return;
    }

    // Fetch display name from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, channel_name')
      .eq('user_id', user.id)
      .maybeSingle();

    const authorName =
      profile?.channel_name ||
      profile?.display_name ||
      user.email?.split('@')[0] ||
      'Anonymous';

    const { error } = await supabase.from('discussions').insert({
      user_id: user.id,
      author_name: authorName,
      category: newPost.category,
      title: newPost.title.trim(),
      content: newPost.content.trim(),
    });

    if (error) {
      toast({ title: 'Error posting', description: error.message, variant: 'destructive' });
      return;
    }

    setNewPost({ title: '', content: '', category: 'Politics' });
    setNewPostVisible(false);
    toast({ title: 'Posted!', description: 'Your discussion is live.' });
    loadDiscussions();
  };

  const filteredDiscussions =
    category === 'All Categories'
      ? discussions
      : discussions.filter((d) => d.category === category);

  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <TalkAtChaHeader />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <DiscussionControls
              categories={CATEGORIES}
              category={category}
              newPostVisible={newPostVisible}
              onCategoryChange={setCategory}
              onNewPostToggle={() => setNewPostVisible(!newPostVisible)}
            />

            {newPostVisible && (
              <NewDiscussionForm
                categories={CATEGORIES}
                newPost={newPost}
                onCancel={() => setNewPostVisible(false)}
                onSubmit={handleNewPost}
                onPostChange={setNewPost}
              />
            )}

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading discussions...</div>
            ) : (
              <DiscussionList
                discussions={filteredDiscussions}
                onCreateClick={() => {
                  if (!user) {
                    navigate('/auth');
                    return;
                  }
                  setNewPostVisible(true);
                }}
              />
            )}
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <FeaturedDiscussionVideo />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TalkAtCha;
