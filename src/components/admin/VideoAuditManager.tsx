import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Copy, ExternalLink, Database, Cloud, AlertTriangle } from 'lucide-react';

interface VideoRow {
  id: string;
  title: string;
  file_name: string | null;
  cloud_url: string | null;
  video_url: string | null;
  is_cloud_stored: boolean | null;
  is_youtube_embed: boolean | null;
  file_size: number | null;
  created_at: string;
}

const PAGE_SIZE = 50;

const formatBytes = (bytes: number | null) => {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
};

const detectBackend = (cloudUrl: string | null): 'supabase' | 'aws_s3' | 'youtube' | 'other' | 'missing' => {
  if (!cloudUrl) return 'missing';
  if (cloudUrl.includes('supabase.co/storage')) return 'supabase';
  if (cloudUrl.includes('amazonaws.com') || cloudUrl.includes('.s3.')) return 'aws_s3';
  if (cloudUrl.includes('youtube.com') || cloudUrl.includes('youtu.be')) return 'youtube';
  return 'other';
};

const extractStorageKey = (cloudUrl: string | null): string => {
  if (!cloudUrl) return '—';
  // Supabase: .../storage/v1/object/public/videos/<key>
  const supaMatch = cloudUrl.match(/\/storage\/v1\/object\/public\/videos\/(.+)$/);
  if (supaMatch) return supaMatch[1];
  // AWS S3 path-style or virtual-hosted
  const s3Match = cloudUrl.match(/amazonaws\.com\/(?:[^/]+\/)?(.+?)(?:\?|$)/);
  if (s3Match) return s3Match[1];
  return cloudUrl.split('/').pop() || cloudUrl;
};

export const VideoAuditManager = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [backendFilter, setBackendFilter] = useState<'all' | 'supabase' | 'aws_s3' | 'missing'>('all');

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('uploaded_videos')
        .select(
          'id, title, file_name, cloud_url, video_url, is_cloud_stored, is_youtube_embed, file_size, created_at',
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })
        .range(from, to);

      if (search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`title.ilike.${term},file_name.ilike.${term},cloud_url.ilike.${term}`);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      setVideos((data || []) as VideoRow[]);
      setTotal(count || 0);
    } catch (err) {
      console.error('Video audit fetch failed:', err);
      toast({
        title: 'Failed to load videos',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchVideos();
  };

  const filtered = useMemo(() => {
    if (backendFilter === 'all') return videos;
    return videos.filter((v) => detectBackend(v.cloud_url) === backendFilter);
  }, [videos, backendFilter]);

  const counts = useMemo(() => {
    return videos.reduce(
      (acc, v) => {
        const b = detectBackend(v.cloud_url);
        acc[b] = (acc[b] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [videos]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied', description: text.slice(0, 80) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Video Storage Audit
        </CardTitle>
        <CardDescription>
          Inspect every uploaded video: original filename, storage backend, and underlying storage key.
          Use this to verify what's actually in your storage buckets vs. what users see on the site.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Backend summary chips (current page) */}
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-muted-foreground">This page:</span>
          {(['all', 'supabase', 'aws_s3', 'missing'] as const).map((b) => {
            const label =
              b === 'all'
                ? `All (${videos.length})`
                : b === 'supabase'
                ? `Supabase (${counts.supabase || 0})`
                : b === 'aws_s3'
                ? `AWS S3 (${counts.aws_s3 || 0})`
                : `Missing URL (${counts.missing || 0})`;
            return (
              <Button
                key={b}
                size="sm"
                variant={backendFilter === b ? 'default' : 'outline'}
                onClick={() => setBackendFilter(b)}
              >
                {label}
              </Button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search by title, original filename, or storage URL…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Title (shown)</TableHead>
                <TableHead className="min-w-[200px]">Original filename</TableHead>
                <TableHead>Backend</TableHead>
                <TableHead className="min-w-[280px]">Storage key</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No videos match the current filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((v) => {
                  const backend = detectBackend(v.cloud_url);
                  const key = extractStorageKey(v.cloud_url);
                  return (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium max-w-[260px] truncate" title={v.title}>
                        {v.title}
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate text-muted-foreground" title={v.file_name || ''}>
                        {v.file_name || '—'}
                      </TableCell>
                      <TableCell>
                        {backend === 'supabase' && (
                          <Badge variant="secondary" className="gap-1">
                            <Cloud className="h-3 w-3" /> Supabase
                          </Badge>
                        )}
                        {backend === 'aws_s3' && (
                          <Badge className="gap-1 bg-orange-500/15 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20">
                            <Cloud className="h-3 w-3" /> AWS S3
                          </Badge>
                        )}
                        {backend === 'youtube' && <Badge variant="outline">YouTube</Badge>}
                        {backend === 'other' && <Badge variant="outline">Other</Badge>}
                        {backend === 'missing' && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" /> Missing
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[320px] truncate" title={key}>
                        {key}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatBytes(v.file_size)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {v.cloud_url && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => copyToClipboard(v.cloud_url!)}
                                title="Copy URL"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => window.open(v.cloud_url!, '_blank')}
                                title="Open in new tab"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Showing {videos.length === 0 ? 0 : page * PAGE_SIZE + 1}–{page * PAGE_SIZE + videos.length} of {total}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * PAGE_SIZE >= total || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
