
import React from 'react';
import { Clock, ThumbsUp, MessageSquare } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  thumbnail: string;
  category: string;
}

interface BlogPostListProps {
  posts: BlogPost[];
}

export const BlogPostList: React.FC<BlogPostListProps> = ({ posts }) => {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
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
  );
};
