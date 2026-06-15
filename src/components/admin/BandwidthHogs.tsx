import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Cloud, HardDrive, ArrowRight } from 'lucide-react';

type Row = {
  id: string;
  title: string | null;
  views: number | null;
  file_size: number | null;
  video_url: string | null;
  cloud_url: string | null;
  is_cloud_stored: boolean | null;
};

const isOnS3 = (r: Row) => {
  const url = r.cloud_url || r.video_url || '';
  return /amazonaws\.com|s3[.-]/i.test(url);
};

const isOnSupabase = (r: Row) => {
  const url = r.video_url || '';
  return url.includes('/storage/v1/object/public/videos/');
};

const fmtBytes = (b: number | null) => {
  if (!b) return '—';
  if (b > 1e9) return `${(b / 1e9).toFixed(2)} GB`;
  if (b > 1e6) return `${(b / 1e6).toFixed(1)} MB`;
  return `${(b / 1024).toFixed(0)} KB`;
};

const estimatedEgressGB = (r: Row) => {
  const size = r.file_size ?? 0;
  const views = r.views ?? 0;
  return (size * views) / 1e9;
};

// $0.09 per GB egress (typical Supabase/AWS rate)
const estimatedCost = (gb: number) => gb * 0.09;

export const BandwidthHogs = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('uploaded_videos')
      .select('id, title, views, file_size, video_url, cloud_url, is_cloud_stored')
      .not('file_size', 'is', null)
      .order('views', { ascending: false })
      .limit(200);
    if (error) {
      toast({ title: 'Failed to load', description: error.message, variant: 'destructive' });
    } else {
      const sorted = (data ?? [])
        .map((r) => r as Row)
        .sort((a, b) => estimatedEgressGB(b) - estimatedEgressGB(a))
        .slice(0, 50);
      setRows(sorted);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const migrate = async (id: string) => {
    setMigrating(id);
    try {
      const { data, error } = await supabase.functions.invoke('migrate-video-to-s3', {
        body: { videoIds: [id], table: 'uploaded_videos', deleteFromSupabase: true },
      });
      if (error) throw error;
      toast({ title: 'Migration started', description: 'Video moved to S3.' });
      await load();
    } catch (e: any) {
      toast({
        title: 'Migration failed',
        description: e?.message ?? String(e),
        variant: 'destructive',
      });
    } finally {
      setMigrating(null);
    }
  };

  const totalSupabaseGB = rows
    .filter(isOnSupabase)
    .reduce((sum, r) => sum + estimatedEgressGB(r), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top Bandwidth Consumers</span>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            Refresh
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Videos ranked by estimated monthly egress (file size × views). Migrate the biggest ones
          on Supabase to S3 to reduce Lovable Cloud balance usage.
        </p>
        {!loading && (
          <div className="text-sm mt-2">
            Top 50 Supabase-hosted videos estimated egress:{' '}
            <strong>{totalSupabaseGB.toFixed(1)} GB</strong> ≈{' '}
            <strong>${estimatedCost(totalSupabaseGB).toFixed(2)}</strong> in bandwidth
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
                  <th className="py-2 pr-2">Size</th>
                  <th className="py-2 pr-2">Views</th>
                  <th className="py-2 pr-2">Est. Egress</th>
                  <th className="py-2 pr-2">Est. Cost</th>
                  <th className="py-2 pr-2">Host</th>
                  <th className="py-2 pr-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const gb = estimatedEgressGB(r);
                  const onS3 = isOnS3(r);
                  const onSb = isOnSupabase(r);
                  return (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2 pr-2 text-muted-foreground">{i + 1}</td>
                      <td className="py-2 pr-2 max-w-[280px] truncate">{r.title ?? '(untitled)'}</td>
                      <td className="py-2 pr-2">{fmtBytes(r.file_size)}</td>
                      <td className="py-2 pr-2">{r.views ?? 0}</td>
                      <td className="py-2 pr-2">{gb.toFixed(2)} GB</td>
                      <td className="py-2 pr-2">${estimatedCost(gb).toFixed(2)}</td>
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
                            disabled={migrating === r.id}
                            onClick={() => migrate(r.id)}
                          >
                            {migrating === r.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                Move to S3 <ArrowRight className="h-3 w-3 ml-1" />
                              </>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-muted-foreground">
                      No videos with file size info yet.
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
