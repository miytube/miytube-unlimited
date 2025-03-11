
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const CreateBlogPost = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save the blog post
    toast({
      title: "Success",
      description: "Blog post created successfully!",
    });

    // Reset form
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto w-full">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded-md border bg-card"
          placeholder="Enter post title"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 rounded-md border bg-card min-h-[200px]"
          placeholder="Write your post content..."
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Publish Post
      </button>
    </form>
  );
};
