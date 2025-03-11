
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Edit, Clock, ThumbsUp, MessageSquare, Share, Bookmark, ChevronRight, Upload } from 'lucide-react';
import { CreateBlogPost } from '@/components/blog/CreateBlogPost';
import { useToast } from "@/hooks/use-toast";
import { FileUploader } from '@/components/FileUploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const blogPosts = [
  {
    id: 'post1',
    title: 'How to Grow Your MiyTube Channel in 2023',
    excerpt: 'Learn the best strategies to grow your audience and increase engagement on your videos.',
    author: 'Content Creator Pro',
    date: 'May 15, 2023',
    readTime: '8 min read',
    likes: 1245,
    comments: 87,
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    category: 'Growth Strategy',
  },
  {
    id: 'post2',
    title: 'Video Editing Tips for Beginners',
    excerpt: 'Start creating professional-looking videos with these simple editing techniques anyone can master.',
    author: 'Edit Master',
    date: 'June 3, 2023',
    readTime: '6 min read',
    likes: 986,
    comments: 53,
    thumbnail: 'https://images.unsplash.com/photo-1574717024453-354056afd6fc?auto=format&fit=crop&w=800&q=80',
    category: 'Tutorials',
  },
  {
    id: 'post3',
    title: 'The Future of Content Creation: AI and Beyond',
    excerpt: 'Explore how artificial intelligence is changing the landscape of content creation and what it means for creators.',
    author: 'Tech Insights',
    date: 'April 29, 2023',
    readTime: '12 min read',
    likes: 1782,
    comments: 124,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    category: 'Technology',
  },
];

const recentPosts = [
  {
    id: 'recent1',
    title: 'Setting Up the Perfect Home Studio',
    date: '3 days ago',
    category: 'Equipment',
  },
  {
    id: 'recent2',
    title: 'Monetization Strategies Beyond AdSense',
    date: '5 days ago',
    category: 'Monetization',
  },
  {
    id: 'recent3',
    title: 'Creating Engaging Thumbnails That Get Clicks',
    date: '1 week ago',
    category: 'Design',
  },
  {
    id: 'recent4',
    title: 'How to Analyze Your Video Performance',
    date: '2 weeks ago',
    category: 'Analytics',
  },
];

const Blog = () => {
  const { toast } = useToast();
  
  const handleUpload = (files: File[]) => {
    toast({
      title: "Blog assets uploaded",
      description: `${files.length} ${files.length === 1 ? 'file' : 'files'} uploaded successfully.`,
    });
  };
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">MiyTube Blog</h1>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors"
              onClick={() => {
                document.getElementById('blog-assets-upload-input')?.click();
              }}
            >
              <Upload size={18} />
              <span>Upload Assets</span>
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                  <Edit size={18} />
                  <span>Create Post</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                </DialogHeader>
                <CreateBlogPost />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <FileUploader
          icon={Edit}
          title="Upload Blog Assets"
          description="Upload images, documents, and other files to include in your blog posts."
          acceptedTypes="image/*,.pdf,.doc,.docx"
          supportedFormats={['JPG', 'PNG', 'WebP', 'PDF', 'DOCX']}
          maxSize="10MB"
          onUpload={handleUpload}
          id="blog-assets-upload-input"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 mt-8">
          <div className="lg:col-span-2">
            <article className="bg-card rounded-lg overflow-hidden shadow-md mb-8">
              <div className="aspect-[2/1] relative">
                <img 
                  src="https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=1200&q=80" 
                  alt="Featured blog post" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <span className="text-white/80 mb-2">Featured Post</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">10 Advanced MiyTube Features Most Creators Don't Know About</h2>
                  <div className="flex items-center text-white/80">
                    <span>By MiyTube Team</span>
                    <span className="mx-2">•</span>
                    <span>June 8, 2023</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      10 min read
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4">
                  Unlock the full potential of MiyTube with these hidden features that can help you create better content, 
                  grow your audience, and optimize your channel for success. From advanced analytics to lesser-known tools, 
                  these tips will give you an edge.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp size={18} />
                      <span>2.4K</span>
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <MessageSquare size={18} />
                      <span>156</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Share size={18} />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Bookmark size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
            
            <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
                  <div className="md:w-1/3 aspect-video md:aspect-square">
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <ThumbsUp size={16} />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare size={16} />
                          <span>{post.comments}</span>
                        </span>
                      </div>
                      <button className="text-primary hover:underline text-sm font-medium">
                        Read More
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button className="px-4 py-2 border rounded-md hover:bg-secondary transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
          
          <div>
            <div className="bg-card rounded-lg p-6 shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {['Growth Strategy', 'Tutorials', 'Technology', 'Equipment', 'Monetization', 'Analytics', 'Community', 'Design'].map((category) => (
                  <li key={category}>
                    <a href="#" className="flex items-center justify-between py-2 hover:text-primary transition-colors">
                      <span>{category}</span>
                      <ChevronRight size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <h4 className="font-medium hover:text-primary transition-colors">
                      <a href="#">{post.title}</a>
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="bg-secondary px-2 py-0.5 rounded-full">{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
