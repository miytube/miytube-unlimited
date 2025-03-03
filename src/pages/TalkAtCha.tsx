
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { MessageCircle, Send, ThumbsUp, ChevronDown, Filter } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Modified mock data for discussions about world events and personal impact
const INITIAL_DISCUSSIONS = [
  {
    id: 1,
    category: 'Politics',
    title: 'How new privacy laws affect your digital life',
    author: 'PrivacyAdvocate',
    content: 'With the recent privacy legislation changes, I\'ve had to adjust how I use social media. Has anyone else changed their online habits?',
    replies: 15,
    likes: 28,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    category: 'Economy',
    title: 'Rising inflation and your monthly budget',
    author: 'BudgetPlanner',
    content: 'I\'ve noticed my grocery bills increasing by about 20% this year. What strategies are you using to manage your household expenses?',
    replies: 22,
    likes: 47,
    timestamp: '4 hours ago',
  },
  {
    id: 3,
    category: 'Climate',
    title: 'Local effects of global warming in your area',
    author: 'ClimateWatcher',
    content: 'Our city experienced unusual flooding this spring. Have you noticed climate change affecting your local environment?',
    replies: 43,
    likes: 86,
    timestamp: '8 hours ago',
  },
  {
    id: 4,
    category: 'Technology',
    title: 'How AI is changing your work environment',
    author: 'TechObserver',
    content: 'My company just implemented AI tools for customer service. Has anyone\'s job been significantly altered by new tech?',
    replies: 31,
    likes: 52,
    timestamp: '1 day ago',
  },
  {
    id: 5,
    category: 'Health',
    title: 'Global health trends affecting your community',
    author: 'HealthAdvocate',
    content: 'After the pandemic, our community is much more conscious about public health. What lasting changes have you seen in your area?',
    replies: 48,
    likes: 103,
    timestamp: '2 days ago',
  },
];

// Updated categories to focus on world events and personal impact
const CATEGORIES = [
  'All Categories',
  'Politics',
  'Economy',
  'Climate',
  'Technology',
  'Health',
  'Culture',
  'Education',
];

const TalkAtCha = () => {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [newPostVisible, setNewPostVisible] = useState(false);
  const [category, setCategory] = useState('All Categories');
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    category: 'Politics' 
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
        <h1 className="text-3xl font-bold mb-6">World Events & You</h1>
        <p className="text-muted-foreground mb-8">
          Discuss how global events affect your personal life. Share your experiences, ask questions,
          and connect with others about the impact of politics, economy, climate, technology, and more on your daily life.
        </p>
        
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button 
                className={`px-4 py-2 flex items-center gap-2 ${newPostVisible ? 'bg-primary text-white' : 'hover:bg-secondary'}`}
                onClick={() => setNewPostVisible(!newPostVisible)}
              >
                <MessageCircle size={18} />
                <span>Share Your Experience</span>
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
            <h2 className="text-xl font-semibold mb-4">Share How World Events Affect You</h2>
            <form onSubmit={handleNewPost}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="category">
                  Topic Area
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
                  Discussion Title
                </label>
                <input 
                  type="text" 
                  id="title"
                  className="w-full p-2 border rounded-lg"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Summarize how a world event affects you"
                  maxLength={100}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1" htmlFor="content">
                  Your Experience
                </label>
                <textarea 
                  id="content"
                  className="w-full p-2 border rounded-lg min-h-[120px]"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Share how this global event or trend has affected your personal life..."
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
                  Share Experience
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
                  Shared by <span className="font-medium">{discussion.author}</span>
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
              <h3 className="text-lg font-medium mb-2">No experiences shared yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share how this topic has affected your personal life!
              </p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                onClick={() => setNewPostVisible(true)}
              >
                Share Your Experience
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TalkAtCha;
