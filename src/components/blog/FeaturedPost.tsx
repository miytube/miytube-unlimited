
import React from 'react';
import { Clock, ThumbsUp, MessageSquare, Share, Bookmark } from 'lucide-react';

export const FeaturedPost = () => {
  return (
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
  );
};
