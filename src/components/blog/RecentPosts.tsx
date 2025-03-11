
import React from 'react';

interface RecentPost {
  id: string;
  title: string;
  date: string;
  category: string;
}

interface RecentPostsProps {
  posts: RecentPost[];
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ posts }) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
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
  );
};
