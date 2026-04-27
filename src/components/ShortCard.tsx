
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { trackEngagement } from '@/hooks/useTrackEngagement';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useToast } from '@/hooks/use-toast';

interface ShortCardProps {
  id: string;
  title: string;
  thumbnail: string;
  creator: string;
  views: string;
  description?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
}

export const ShortCard: React.FC<ShortCardProps> = ({
  id,
  title,
  thumbnail,
  creator,
  views,
  description = '',
  category,
  subcategory,
  tags = [],
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { isUploadedVideo, updateUploadedVideo, deleteUploadedVideo } = useUploadedVideos();
  const { toast } = useToast();

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
      title: "Short updated",
      description: "Your short has been updated successfully.",
    });
  };

  const handleDelete = () => {
    deleteUploadedVideo(id);
    toast({
      title: "Short deleted",
      description: "Your short has been deleted.",
    });
  };

  return (
    <div className="group relative flex flex-col rounded-lg overflow-hidden hover:shadow-md transition-all bg-card">
      <Link 
        to={`/shorts/${id}`} 
        className="flex flex-col flex-1"
        onClick={() => trackEngagement(id, 'click')}
      >
        {/* Fixed aspect ratio container */}
        <div className="relative aspect-[9/16] bg-muted overflow-hidden">
          <div className={`w-full h-full ${!imageLoaded ? 'lazy-image-loading' : ''}`}>
            <img 
              src={thumbnail} 
              alt={title} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-1 py-0.5 text-xs bg-black/70 text-white rounded">
            Short
          </div>
        </div>
        {/* Content area */}
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-sm line-clamp-2 leading-tight mb-1 pr-6">
            {title}
          </h3>
          <div className="mt-auto text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>{creator}</span>
              <span>{views} views</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Edit/Delete Menu for uploaded shorts */}
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
            <AlertDialogTitle>Delete Short</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this short? This action cannot be undone.
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
    </div>
  );
};
