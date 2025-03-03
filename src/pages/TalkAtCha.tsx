
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { MessageCircle, Send, ThumbsUp, ChevronDown, Filter } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock data for discussions
const INITIAL_DISCUSSIONS = [
  {
    id: 1,
    category: 'World Events',
    title: 'Current events in Europe and their global impact',
    author: 'GlobalObserver',
    content: 'With the ongoing changes in Europe, how do you think this will affect global trade policies?',
    replies: 15,
    likes: 28,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    category: 'Business',
    title: 'Tech startups to watch in 2023',
    author: 'TechEntrepreneur',
    content: 'I\'ve been following several promising startups in the AI sector. Which companies are on your radar?',
    replies: 22,
    likes: 47,
    timestamp: '4 hours ago',
  },
  {
    id: 3,
    category: 'Music',
    title: 'Evolution of hip-hop over the decades',
    author: 'MusicHistorian',
    content: 'The transition from early hip-hop to today\'s sound is fascinating. What era do you think was most influential?',
    replies: 43,
    likes: 86,
    timestamp: '8 hours ago',
  },
  {
    id: 4,
    category: 'Stocks',
    title: 'Market predictions for next quarter',
    author: 'InvestorInsight',
    content: 'With current inflation trends, which sectors might outperform in the coming quarter?',
    replies: 31,
    likes: 52,
    timestamp: '1 day ago',
  },
  {
    id: 5,
    category: 'Books',
    title: 'Must-read books for personal growth',
    author: 'BookWorm',
    content: 'I\'ve recently finished "Atomic Habits" and it changed my perspective. What books have significantly impacted you?',
    replies: 48,
    likes: 103,
    timestamp: '2 days ago',
  },
];

const CATEGORIES = [
  'All Categories',
  'World Events',
  'Money',
  'Music',
  'Business',
  'Books',
  'Stocks',
  'Employment',
];

const TalkAtCha = () => {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [newPostVisible, setNewPostVisible] = useState(false);
  const [category, setCategory] = useState('All Categories');
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    category: 'World Events' 
  });
  
  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    const post = {
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
    setNewPost({ title: '', content: '', category: 'World Events' });
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
        <h1 className="text-3xl font-bold mb-6">Talk At Cha</h1>
        <p className="text-muted-foreground mb-8">
          Join discussions about world events, money, music, business, books, stocks, employment and more. 
          Ask questions, share insights, and connect with others who share your interests.
        </p>
        
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button 
                className={`px-4 py-2 flex items-center gap-2 ${newPostVisible ? 'bg-primary text-white' : 'hover:bg-secondary'}`}
                onClick={() => setNewPostVisible(!newPostVisible)}
              >
                <MessageCircle size={18} />
                <span>New Discussion</span>
              </button>
            </div>
            
            <div className="border rounded-lg flex items-center">
              <div className="relative">
                <select 
                  className="appearance-none bg-transparent px-4 py-2 pr-8 rounded-lg cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="border rounded-lg p-2 text-sm">
              <option>Most Recent</option>
              <option>Most Popular</option>
              <option>Most Replies</option>
            </select>
          </div>
        </div>
        
        {newPostVisible && (
          <div className="mb-8 bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Start a New Discussion</h2>
            <form onSubmit={handleNewPost}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="category">
                  Category
                </label>
                <select 
                  id="category"
                  className="w-full p-2 border rounded-lg"
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                >
                  {CATEGORIES.filter(cat => cat !== 'All Categories').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="title">
                  Title
                </label>
                <input 
                  type="text" 
                  id="title"
                  className="w-full p-2 border rounded-lg"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter a title for your discussion"
                  maxLength={100}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1" htmlFor="content">
                  Content
                </label>
                <textarea 
                  id="content"
                  className="w-full p-2 border rounded-lg min-h-[120px]"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Share your thoughts or question..."
                  maxLength={2000}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded-lg hover:bg-secondary"
                  onClick={() => setNewPostVisible(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="space-y-4">
          {filteredDiscussions.length > 0 ? filteredDiscussions.map(discussion => (
            <div key={discussion.id} className="bg-card p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 bg-secondary rounded-full">{discussion.category}</span>
                <span className="text-xs text-muted-foreground">{discussion.timestamp}</span>
              </div>
              <h3 className="text-lg font-medium mb-2">{discussion.title}</h3>
              <p className="text-muted-foreground mb-4">{discussion.content}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Posted by <span className="font-medium">{discussion.author}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <MessageCircle size={16} />
                    <span>{discussion.replies} replies</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <ThumbsUp size={16} />
                    <span>{discussion.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-card p-8 rounded-lg shadow-md text-center">
              <MessageCircle size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a discussion in this category!
              </p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                onClick={() => setNewPostVisible(true)}
              >
                Start a Discussion
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TalkAtCha;
