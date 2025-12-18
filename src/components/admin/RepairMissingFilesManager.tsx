import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Trash2, RefreshCw, FileWarning } from 'lucide-react';
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

interface BrokenVideo {
  id: string;
  title: string;
  category: string | null;
  created_at: string;
  has_video_url: boolean;
  has_cloud_url: boolean;
  has_youtube_id: boolean;
}

export const RepairMissingFilesManager = () => {
  const [brokenVideos, setBrokenVideos] = useState<BrokenVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const scanForBrokenVideos = async () => {
    setScanning(true);
    setBrokenVideos([]);
    setSelectedIds(new Set());

    try {
      const { data, error } = await supabase
        .from('uploaded_videos')
        .select('id, title, category, created_at, video_url, cloud_url, youtube_video_id')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const broken = (data || [])
        .filter(v => !v.video_url && !v.cloud_url && !v.youtube_video_id)
        .map(v => ({
          id: v.id,
          title: v.title,
          category: v.category,
          created_at: v.created_at,
          has_video_url: !!v.video_url,
          has_cloud_url: !!v.cloud_url,
          has_youtube_id: !!v.youtube_video_id,
        }));

      setBrokenVideos(broken);
      toast({
        title: "Scan Complete",
        description: `Found ${broken.length} video(s) with missing file sources.`,
      });
    } catch (error) {
      console.error('Error scanning videos:', error);
      toast({
        title: "Scan Failed",
        description: "Failed to scan for broken videos.",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === brokenVideos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(brokenVideos.map(v => v.id)));
    }
  };

  const deleteSelectedVideos = async () => {
    if (selectedIds.size === 0) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('uploaded_videos')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      setBrokenVideos(prev => prev.filter(v => !selectedIds.has(v.id)));
      setSelectedIds(new Set());
      setShowDeleteDialog(false);

      toast({
        title: "Videos Removed",
        description: `Successfully removed ${selectedIds.size} broken video record(s).`,
      });
    } catch (error) {
      console.error('Error deleting videos:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete selected videos.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileWarning className="h-5 w-5 text-warning" />
          <CardTitle>Repair Missing Files</CardTitle>
        </div>
        <CardDescription>
          Identify and remove video records that have no playable file source (no video URL, cloud URL, or YouTube embed).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={scanForBrokenVideos} disabled={scanning}>
            <RefreshCw className={`h-4 w-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning...' : 'Scan for Broken Videos'}
          </Button>
          
          {selectedIds.size > 0 && (
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedIds.size})
            </Button>
          )}
        </div>

        {brokenVideos.length > 0 ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span>Found {brokenVideos.length} video(s) with missing file sources</span>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.size === brokenVideos.length && brokenVideos.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokenVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(video.id)}
                        onCheckedChange={() => toggleSelect(video.id)}
                      />
                    </TableCell>
                    <TableCell className="max-w-xs truncate font-medium">
                      {video.title}
                    </TableCell>
                    <TableCell>{video.category || 'Uncategorized'}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">No File Source</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(video.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : scanning ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            Scanning uploaded videos...
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Click "Scan for Broken Videos" to identify videos with missing file sources.
          </p>
        )}

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Broken Videos?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove {selectedIds.size} video record(s) that have no playable file source. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={deleteSelectedVideos} 
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
