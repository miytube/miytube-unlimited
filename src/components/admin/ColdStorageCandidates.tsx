import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Cloud, HardDrive, ArrowRight, Snowflake } from 'lucide-react';

type Row = {
  id: string;
  title: string | null;
  views: number | null;
  file_size: number | null;
  video_url: string | null;
  cloud_url: string | null;
  created_at: string | null;
};

const isOnS3 = (r: Row) => {
  const url = r.cloud_url || r.video_url || '';
  return /amazonaws\.com|s3[.-]/i.test(url);
};
const isOnSupabase = (r: Row) => (r.video_url || '').includes('/storage/v1/object/public/videos/');

const fmtBytes = (b: number | null) => {
  if (!b) return '—';
  if (b > 1e9) return `${(b / 1e9).toFixed(2)} GB`;
  if (b > 1e6) return `${(b / 1e6).toFixed(1)} MB`;
  return `${(b / 1024).toFixed(0)} KB`;
};

const daysSince = (iso: string | null) => {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
};

const PAGE_SIZE = 50;

export const ColdStorageCandidates = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState<string | null>(null);
  const [bulkMigrating, setBulkMigrating] = useState(false);
  const [maxViews, setMaxViews] = useState(5);
  const [minAgeDays, setMinAgeDays] = useState(30);
  const [onlySupabase, setOnlySupabase] = useState(true);

  const load = async () => {
    setLoading(true);
    const cutoff = new Date(Date.now() - minAgeDays * 86_400_000).toISOString();
    let q = supabase
      .from('uploaded_videos')
      .select('id, title, views, file_size, video_url, cloud_url, created_at')
      .lte('views', maxViews)
      .lte('created_at', cutoff)
      .not('file_size', 'is', null)
      .order('views', { ascending: true })
      .order('file_size', { ascending: false })
      .limit(PAGE_SIZE);

    const { data, error } = await q;
    if (error) {
      toast({ title: 'Failed to load', description: error.message, variant: 'destructive' });
      setRows([]);
    } else {
      let list = (data ?? []) as Row[];
      if (onlySupabase) list = list.filter(isOnSupabase);
      setRows(list);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxViews, minAgeDays, onlySupabase]);

  const migrate = async (id: string) => {
    setMigrating(id);
    try {
      const { error } = await supabase.functions.invoke('migrate-video-to-s3', {
        body: { videoIds: [id], table: 'uploaded_videos', deleteFromSupabase: true },
      });
      if (error) throw error;
      toast({ title: 'Moved to S3', description: 'Video archived to AWS S3.' });
      setRows((rs) => rs.filter((r) => r.id !== id));
    } catch (e: any) {
      toast({ title: 'Migration failed', description: e?.message ?? String(e), variant: 'destructive' });
    } finally {
      setMigrating(null);
    }
  };

  const migrateAll = async () => {
    const targets = rows.filter(isOnSupabase).map((r) => r.id);
    if (targets.length === 0) return;
    setBulkMigrating(true);
    let ok = 0;
    let fail = 0;
    for (const id of targets) {
      try {
        const { error } = await supabase.functions.invoke('migrate-video-to-s3', {
          body: { videoIds: [id], table: 'uploaded_videos', deleteFromSupabase: true },
        });
        if (error) throw error;
        ok++;
        setRows((rs) => rs.filter((r) => r.id !== id));
      } catch {
        fail++;
      }
    }
    setBulkMigrating(false);
    toast({ title: 'Bulk migration complete', description: `${ok} moved, ${fail} failed.` });
  };

  const totalGB = rows.reduce((s, r) => s + (r.file_size ?? 0), 0) / 1e9;
  const supabaseCount = rows.filter(isOnSupabase).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 flex-wrap">
          <span className="flex items-center gap-2">
            <Snowflake className="h-5 w-5" /> Cold Storage Candidates
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={migrateAll}
              disabled={bulkMigrating || supabaseCount === 0}
            >
              {bulkMigrating ? (
                <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Migrating…</>
              ) : (
                <>Move all {supabaseCount} to S3 <ArrowRight className="h-3 w-3 ml-1" /></>
              )}
            </Button>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Least-watched videos — safe candidates for archiving to AWS S3 to free Lovable Cloud storage.
        </p>

        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <label className="flex items-center gap-2">
            Max views:
            <input
              type="number"
              min={0}
              value={maxViews}
              onChange={(e) => setMaxViews(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded bg-background"
            />
          </label>
          <label className="flex items-center gap-2">
            Min age (days):
            <input
              type="number"
              min={0}
              value={minAgeDays}
              onChange={(e) => setMinAgeDays(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded bg-background"
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={onlySupabase}
              onChange={(e) => setOnlySupabase(e.target.checked)}
            />
            Only show Lovable Cloud videos
          </label>
        </div>

        {!loading && (
          <div className="text-sm mt-2">
            Showing <strong>{rows.length}</strong> videos · Total size:{' '}
            <strong>{totalGB.toFixed(2)} GB</strong> · On Lovable Cloud:{' '}
            <strong>{supabaseCount}</strong>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b">
                <tr>
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 pr-2">Title</th>
                  <th className="py-2 pr-2">Views</th>
                  <th className="py-2 pr-2">Size</th>
                  <th className="py-2 pr-2">Age</th>
                  <th className="py-2 pr-2">Host</th>
                  <th className="py-2 pr-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const onS3 = isOnS3(r);
                  const onSb = isOnSupabase(r);
                  return (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2 pr-2 text-muted-foreground">{i + 1}</td>
                      <td className="py-2 pr-2 max-w-[320px] truncate">{r.title ?? '(untitled)'}</td>
                      <td className="py-2 pr-2">{r.views ?? 0}</td>
                      <td className="py-2 pr-2">{fmtBytes(r.file_size)}</td>
                      <td className="py-2 pr-2">{daysSince(r.created_at)}d</td>
                      <td className="py-2 pr-2">
                        {onS3 ? (
                          <Badge variant="secondary" className="gap-1">
                            <Cloud className="h-3 w-3" /> S3
                          </Badge>
                        ) : onSb ? (
                          <Badge variant="destructive" className="gap-1">
                            <HardDrive className="h-3 w-3" /> Cloud
                          </Badge>
                        ) : (
                          <Badge variant="outline">External</Badge>
                        )}
                      </td>
                      <td className="py-2 pr-2">
                        {onSb && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={migrating === r.id || bulkMigrating}
                            onClick={() => migrate(r.id)}
                          >
                            {migrating === r.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>Move to S3 <ArrowRight className="h-3 w-3 ml-1" /></>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No videos match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
