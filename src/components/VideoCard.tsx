import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { VideoEditDialog } from '@/components/watch/VideoEditDialog';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useToast } from '@/hooks/use-toast';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  timestamp: string;
  duration: string;
  description?: string;
  tags?: string[];
  category?: string;
  subcategory?: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  thumbnail,
  channelName,
  views,
  timestamp,
  duration,
  description = '',
  tags = [],
  category,
  subcategory,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { isUploadedVideo, updateUploadedVideo, deleteUploadedVideo } = useUploadedVideos();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isUploaded = isUploadedVideo(id);

  const handleEditSave = (updates: {
    title: string;
    description: string;
    category?: string;
    subcategory?: string;
    tags: string[];
  }) => {
    updateUploadedVideo(id, updates);
    toast({
      title: "Video updated",
      description: "Your video has been updated successfully.",
    });
  };

  const handleDelete = () => {
    deleteUploadedVideo(id);
    toast({
      title: "Video deleted",
      description: "Your video has been deleted.",
    });
  };

  return (
    <article className="w-full group relative">
      <Link to={`/watch?v=${id}`} className="block">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <div className={`absolute inset-0 ${!imageLoaded ? 'lazy-image-loading' : ''}`}>
            <img
              src={thumbnail}
              alt={title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>
          <span className="absolute bottom-2 right-2 px-1 py-0.5 text-xs bg-black/70 text-white rounded">
            {duration}
          </span>
        </div>
        <div className="mt-2">
          <h3 className="font-medium text-sm line-clamp-2 pr-8">{title}</h3>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-secondary px-1.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-1 text-sm text-muted-foreground">
            <p>{channelName}</p>
            <div className="flex items-center gap-1 text-xs">
              <span>{views} views</span>
              <span>•</span>
              <span>{timestamp}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Edit/Delete Menu for uploaded videos */}
      {isUploaded && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Edit Dialog */}
      <VideoEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        video={{
          id,
          title,
          description,
          category,
          subcategory,
          tags,
        }}
        onSave={handleEditSave}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
};
