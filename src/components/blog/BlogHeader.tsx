
import React from 'react';
import { Edit, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateBlogPost } from './CreateBlogPost';

export const BlogHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">MiyTube Blog</h1>
      <div className="flex gap-2">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors"
          onClick={() => navigate('/upload')}
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
  );
};
