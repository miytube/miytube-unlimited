import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Copy, ExternalLink, Database, Cloud, AlertTriangle, UploadCloud, Loader2, Tag } from 'lucide-react';

// Old S3 keys have the form videos/{id}/{timestamp}/{rand}/{filename} —
// multiple "/" segments under videos/. New keys are videos/{title}-{6id}.{ext}.
const needsRekey = (cloudUrl: string | null) => {
  if (!cloudUrl) return false;
  if (!cloudUrl.includes('amazonaws.com') && !cloudUrl.includes('.s3.')) return false;
  const m = cloudUrl.match(/amazonaws\.com\/(.+?)(?:\?|$)/);
  if (!m) return false;
  const key = decodeURIComponent(m[1]);
  // new format has exactly one slash (videos/foo-abc123.mp4)
  return (key.match(/\//g) || []).length > 1;
};

const thumbOnSupabase = (url: string | null | undefined) =>
  !!url && url.includes('supabase.co/storage');

interface VideoRow {
  id: string;
  title: string;
  file_name: string | null;
  cloud_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
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
  const supaMatch = cloudUrl.match(/\/storage\/v1\/object\/public\/videos\/(.+)$/);
  if (supaMatch) return supaMatch[1];
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [migrating, setMigrating] = useState<Set<string>>(new Set());
  const [rekeying, setRekeying] = useState<Set<string>>(new Set());
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkRekeying, setBulkRekeying] = useState(false);
  const [bulkThumbs, setBulkThumbs] = useState(false);
  const [deleteAfter, setDeleteAfter] = useState(true);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('uploaded_videos')
        .select(
          'id, title, file_name, cloud_url, video_url, thumbnail_url, is_cloud_stored, is_youtube_embed, file_size, created_at',
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
      setSelected(new Set());
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

  const migrate = async (ids: string[]) => {
    if (ids.length === 0) return;
    const { data, error } = await supabase.functions.invoke('migrate-video-to-s3', {
      body: { videoIds: ids, table: 'uploaded_videos', deleteFromSupabase: deleteAfter },
    });
    if (error) throw new Error(error.message);
    return data as { results: Array<{ id: string; status: string; message?: string; newUrl?: string }> };
  };

  const handleMigrateOne = async (id: string) => {
    setMigrating((prev) => new Set(prev).add(id));
    try {
      const data = await migrate([id]);
      const r = data?.results?.[0];
      if (!r) throw new Error('No response');
      if (r.status === 'migrated') {
        toast({ title: 'Sent to AWS S3', description: r.newUrl?.slice(0, 80) });
      } else {
        toast({
          title: r.status === 'skipped' ? 'Skipped' : 'Failed',
          description: r.message || r.status,
          variant: r.status === 'failed' ? 'destructive' : 'default',
        });
      }
      await fetchVideos();
    } catch (err) {
      toast({
        title: 'Migration failed',
        description: err instanceof Error ? err.message : 'Unknown',
        variant: 'destructive',
      });
    } finally {
      setMigrating((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const handleMigrateBulk = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBulkRunning(true);
    try {
      // chunk into batches of 10 to avoid edge-function timeouts on large files
      const chunks: string[][] = [];
      for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));
      let migrated = 0, failed = 0, skipped = 0;
      for (const chunk of chunks) {
        const data = await migrate(chunk);
        for (const r of data?.results ?? []) {
          if (r.status === 'migrated') migrated++;
          else if (r.status === 'failed') failed++;
          else skipped++;
        }
      }
      toast({
        title: 'Bulk migration complete',
        description: `${migrated} migrated, ${skipped} skipped, ${failed} failed.`,
        variant: failed > 0 ? 'destructive' : 'default',
      });
      await fetchVideos();
    } catch (err) {
      toast({
        title: 'Bulk migration failed',
        description: err instanceof Error ? err.message : 'Unknown',
        variant: 'destructive',
      });
    } finally {
      setBulkRunning(false);
    }
  };

  const rekey = async (ids: string[]) => {
    if (ids.length === 0) return;
    const { data, error } = await supabase.functions.invoke('rekey-s3-video', {
      body: { videoIds: ids, table: 'uploaded_videos' },
    });
    if (error) throw new Error(error.message);
    return data as { results: Array<{ id: string; status: string; message?: string; newUrl?: string; newKey?: string }> };
  };

  const handleRekeyOne = async (id: string) => {
    setRekeying((prev) => new Set(prev).add(id));
    try {
      const data = await rekey([id]);
      const r = data?.results?.[0];
      if (!r) throw new Error('No response');
      if (r.status === 'rekeyed') {
        toast({ title: 'Renamed on S3', description: r.newKey });
      } else {
        toast({
          title: r.status === 'skipped' ? 'Skipped' : 'Failed',
          description: r.message || r.status,
          variant: r.status === 'failed' ? 'destructive' : 'default',
        });
      }
      await fetchVideos();
    } catch (err) {
      toast({
        title: 'Rename failed',
        description: err instanceof Error ? err.message : 'Unknown',
        variant: 'destructive',
      });
    } finally {
      setRekeying((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const handleRekeyBulk = async () => {
    const ids = filtered.filter((v) => needsRekey(v.cloud_url)).map((v) => v.id);
    if (ids.length === 0) {
      toast({ title: 'Nothing to rename', description: 'No old-format S3 keys on this page.' });
      return;
    }
    setBulkRekeying(true);
    try {
      const chunks: string[][] = [];
      for (let i = 0; i < ids.length; i += 5) chunks.push(ids.slice(i, i + 5));
      let rekeyed = 0, failed = 0, skipped = 0;
      for (const chunk of chunks) {
        const data = await rekey(chunk);
        for (const r of data?.results ?? []) {
          if (r.status === 'rekeyed') rekeyed++;
          else if (r.status === 'failed') failed++;
          else skipped++;
        }
      }
      toast({
        title: 'Bulk rename complete',
        description: `${rekeyed} renamed, ${skipped} skipped, ${failed} failed. Old S3 objects remain — delete in AWS console.`,
        variant: failed > 0 ? 'destructive' : 'default',
      });
      await fetchVideos();
    } catch (err) {
      toast({
        title: 'Bulk rename failed',
        description: err instanceof Error ? err.message : 'Unknown',
        variant: 'destructive',
      });
    } finally {
      setBulkRekeying(false);
    }
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleAllSupabase = () => {
    const supabaseIds = filtered.filter((v) => detectBackend(v.cloud_url) === 'supabase').map((v) => v.id);
    const allSelected = supabaseIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const n = new Set(prev);
      if (allSelected) supabaseIds.forEach((id) => n.delete(id));
      else supabaseIds.forEach((id) => n.add(id));
      return n;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Video Storage Audit
        </CardTitle>
        <CardDescription>
          New uploads default to Supabase (lower cost). Use the "Send to AWS S3" buttons below to migrate
          specific videos to AWS S3 on demand.
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

        {/* Bulk action bar */}
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-md border bg-muted/30">
          <Button size="sm" variant="outline" onClick={toggleAllSupabase}>
            Select all Supabase on page
          </Button>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={deleteAfter}
              onCheckedChange={(c) => setDeleteAfter(!!c)}
            />
            Delete from Supabase after migration
          </label>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selected.size} selected</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRekeyBulk}
              disabled={bulkRekeying}
              title="Rename all old-format S3 keys on this page to title-based names"
            >
              {bulkRekeying ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Tag className="h-4 w-4 mr-1" />
              )}
              Rename old S3 keys to titles
            </Button>
            <Button
              size="sm"
              onClick={handleMigrateBulk}
              disabled={selected.size === 0 || bulkRunning}
            >
              {bulkRunning ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4 mr-1" />
              )}
              Send selected to AWS S3
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
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
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No videos match the current filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((v) => {
                  const backend = detectBackend(v.cloud_url);
                  const key = extractStorageKey(v.cloud_url);
                  const canMigrate = backend === 'supabase';
                  const canRekey = needsRekey(v.cloud_url);
                  const isMigrating = migrating.has(v.id);
                  const isRekeying = rekeying.has(v.id);
                  return (
                    <TableRow key={v.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(v.id)}
                          onCheckedChange={() => toggleRow(v.id)}
                          disabled={!canMigrate}
                        />
                      </TableCell>
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
                          {canMigrate && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMigrateOne(v.id)}
                              disabled={isMigrating}
                              title="Send this video to AWS S3"
                            >
                              {isMigrating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UploadCloud className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {canRekey && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRekeyOne(v.id)}
                              disabled={isRekeying}
                              title="Rename this S3 object to a title-based key"
                            >
                              {isRekeying ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Tag className="h-4 w-4" />
                              )}
                            </Button>
                          )}
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
