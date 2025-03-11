
import React from 'react';
import { Layout } from '@/components/Layout';
import { useToast } from "@/hooks/use-toast";
import { BlogHeader } from '@/components/blog/BlogHeader';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { BlogPostList } from '@/components/blog/BlogPostList';
import { BlogCategories } from '@/components/blog/BlogCategories';
import { RecentPosts } from '@/components/blog/RecentPosts';
import { blogPosts, recentPosts } from '@/components/blog/blogData';

const Blog = () => {
  const { toast } = useToast();
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <BlogHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 mt-8">
          <div className="lg:col-span-2">
            <FeaturedPost />
            
            <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
            <BlogPostList posts={blogPosts} />
            
            <div className="mt-8 flex justify-center">
              <button className="px-4 py-2 border rounded-md hover:bg-secondary transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
          
          <div>
            <BlogCategories />
            <RecentPosts posts={recentPosts} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
