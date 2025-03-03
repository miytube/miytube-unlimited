import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useToast } from "@/hooks/use-toast";
import { Discussion } from '@/components/discussions/DiscussionCard';
import { NewDiscussionForm, NewPostFormData } from '@/components/discussions/NewDiscussionForm';
import { DiscussionControls } from '@/components/discussions/DiscussionControls';
import { DiscussionList } from '@/components/discussions/DiscussionList';
import { TalkAtChaHeader } from '@/components/discussions/TalkAtChaHeader';
import { INITIAL_DISCUSSIONS, CATEGORIES } from '@/components/discussions/discussionConstants';

const TalkAtCha = () => {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);
  const [newPostVisible, setNewPostVisible] = useState(false);
  const [category, setCategory] = useState('All Categories');
  const [newPost, setNewPost] = useState<NewPostFormData>({ 
    title: '', 
    content: '', 
    category: 'Politics' 
  });
  
  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    const post: Discussion = {
      id: discussions.length + 1,
      category: newPost.category,
      title: newPost.title,
      author: 'CurrentUser',
      content: newPost.content,
      replies: 0,
      likes: 0,
      timestamp: 'Just now',
    };
    
    setDiscussions([post, ...discussions]);
    setNewPost({ title: '', content: '', category: 'Politics' });
    setNewPostVisible(false);
    
    toast({
      title: "Success!",
      description: "Your discussion has been posted.",
    });
  };
  
  const filteredDiscussions = category === 'All Categories' 
    ? discussions 
    : discussions.filter(d => d.category === category);

  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <TalkAtChaHeader />
        
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
        
        <DiscussionList 
          discussions={filteredDiscussions}
          onCreateClick={() => setNewPostVisible(true)}
        />
      </div>
    </Layout>
  );
};

export default TalkAtCha;
