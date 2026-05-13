import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Image as ImageIcon, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface VideoRow {
  id: string;
  title: string;
  cloud_url: string | null;
  video_url: string | null;
  thumbnail_url?: string | null;
}

interface Result {
  id: string;
  status: 'updated' | 'error' | 'skipped';
  thumbnail_url?: string;
  reason?: string;
}

import { captureVideoThumbnailFromUrl } from '@/utils/thumbnailCapture';

/**
 * Captures a non-black frame from a remote video URL using the shared utility,
 * which seeks past common black intros and retries deeper offsets if the first
 * frame is all-black.
 */
function captureFrame(videoUrl: string): Promise<Blob | null> {
  return captureVideoThumbnailFromUrl(videoUrl);
}

/** Loads an image and returns true if it's all/near-black (likely a bad thumbnail). */
async function isImageDark(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const t = setTimeout(() => resolve(false), 8000);
    img.onerror = () => { clearTimeout(t); resolve(false); };
    img.onload = () => {
      clearTimeout(t);
      try {
        const w = 32, h = 32;
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        if (!ctx) return resolve(false);
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let total = 0;
        for (let i = 0; i < data.length; i += 4) total += data[i] + data[i + 1] + data[i + 2];
        const avg = total / ((data.length / 4) * 3);
        resolve(avg < 12);
      } catch {
        resolve(false);
      }
    };
    img.src = url;
  });
}

export const ThumbnailGeneratorManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [batchSize, setBatchSize] = useState(10);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<'missing' | 'regenerate'>('missing');
  const continueRef = useRef(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [updated, setUpdated] = useState(0);
  const [errors, setErrors] = useState(0);
  const [recent, setRecent] = useState<Result[]>([]);

  const fetchRemaining = async () => {
    let q = supabase
      .from('uploaded_videos')
      .select('id', { count: 'exact', head: true })
      .eq('is_cloud_stored', true);
    q = mode === 'missing' ? q.is('thumbnail_url', null) : q.not('thumbnail_url', 'is', null);
    const { count } = await q;
    setRemaining(count ?? 0);
  };

  useEffect(() => { fetchRemaining(); }, [mode]);

  const processOne = async (row: VideoRow): Promise<Result> => {
    const src = row.cloud_url || row.video_url;
    if (!src) return { id: row.id, status: 'skipped', reason: 'no video url' };

    // In regenerate mode, only re-process if existing thumbnail looks dark/black.
    if (mode === 'regenerate' && row.thumbnail_url) {
      const dark = await isImageDark(row.thumbnail_url);
      if (!dark) return { id: row.id, status: 'skipped', reason: 'thumbnail looks fine' };
    }

    const blob = await captureFrame(src);
    if (!blob) return { id: row.id, status: 'error', reason: 'frame capture failed (CORS or codec)' };

    const path = `${user!.id}/auto/${row.id}.jpg`;
    const { error: upErr } = await supabase.storage
      .from('thumbnails')
      .upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    if (upErr) return { id: row.id, status: 'error', reason: `upload: ${upErr.message}` };

    const { data: pub } = supabase.storage.from('thumbnails').getPublicUrl(path);
    const thumbUrl = `${pub.publicUrl}?v=${Date.now()}`;

    const { error: dbErr } = await supabase
      .from('uploaded_videos')
      .update({ thumbnail_url: thumbUrl })
      .eq('id', row.id);
    if (dbErr) return { id: row.id, status: 'error', reason: `db: ${dbErr.message}` };

    return { id: row.id, status: 'updated', thumbnail_url: thumbUrl };
  };

  const runBatch = async (): Promise<{ updated: number; errors: number; processed: number }> => {
    let q = supabase
      .from('uploaded_videos')
      .select('id, title, cloud_url, video_url, thumbnail_url')
      .eq('is_cloud_stored', true)
      .order('created_at', { ascending: false })
      .limit(batchSize);
    q = mode === 'missing' ? q.is('thumbnail_url', null) : q.not('thumbnail_url', 'is', null);
    const { data, error } = await q;
    if (error) throw error;

    const rows = (data || []) as VideoRow[];
    console.log('[thumb-gen] got rows:', rows.length, rows.map(r => r.id));
    if (rows.length === 0) {
      setRecent((prev) => [{ id: 'batch', status: 'skipped' as const, reason: 'select returned 0 rows (check RLS / filters)' }, ...prev].slice(0, 60));
    }
    let u = 0; let e = 0;
    const results: Result[] = [];
    for (const r of rows) {
      console.log('[thumb-gen] processing', r.id, r.cloud_url || r.video_url);
      const res = await processOne(r);
      console.log('[thumb-gen] result for', r.id, res);
      results.push(res);
      if (res.status === 'updated') u++;
      else if (res.status === 'error') e++;
      // Update UI as we go so user sees progress
      setRecent((prev) => [res, ...prev].slice(0, 60));
      if (res.status === 'updated') setUpdated((n) => n + 1);
      else if (res.status === 'error') setErrors((n) => n + 1);
    }
    return { updated: u, errors: e, processed: rows.length };
  };

  const handleOne = async () => {
    if (!user) return;
    setRunning(true);
    try {
      const r = await runBatch();
      toast({ title: 'Batch complete', description: `Generated ${r.updated} • Errors ${r.errors}` });
      await fetchRemaining();
    } catch (err: any) {
      toast({ title: 'Failed', description: err.message, variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  const handleAll = async () => {
    if (!user) return;
    setRunning(true);
    continueRef.current = true;
    try {
      while (continueRef.current) {
        const r = await runBatch();
        await fetchRemaining();
        if (r.processed === 0) break;
        await new Promise((res) => setTimeout(res, 800));
      }
      toast({ title: 'Done', description: 'All videos processed.' });
    } catch (err: any) {
      toast({ title: 'Stopped', description: err.message, variant: 'destructive' });
    } finally {
      setRunning(false);
      continueRef.current = false;
    }
  };

  const stop = () => { continueRef.current = false; };

  const total = (updated + (remaining ?? 0)) || 1;
  const pct = (updated / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          Generate Video Thumbnails
        </CardTitle>
        <CardDescription>
          Captures a frame from each video in your browser, uploads it as a JPEG thumbnail, and saves
          the URL on the video. Required before AI Auto-Title can analyze the videos.
          Keep this tab open and active while it runs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-muted-foreground">Videos missing thumbnails</p>
            <p className="text-2xl font-bold">{remaining?.toLocaleString() ?? '…'}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-muted-foreground">Generated this session</p>
            <p className="text-2xl font-bold text-green-500">{updated}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-muted-foreground">Errors</p>
            <p className="text-2xl font-bold text-destructive">{errors}</p>
          </div>
        </div>

        <div className="flex items-end gap-3 flex-wrap">
          <div className="max-w-[180px]">
            <Label htmlFor="thumb-batch">Batch size (1-25)</Label>
            <Input
              id="thumb-batch"
              type="number"
              min={1}
              max={25}
              value={batchSize}
              onChange={(e) => setBatchSize(Math.max(1, Math.min(25, Number(e.target.value) || 10)))}
              disabled={running}
            />
          </div>
          <Button onClick={handleOne} disabled={running || !user}>
            {running && !continueRef.current ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ImageIcon className="h-4 w-4 mr-2" />}
            Run one batch
          </Button>
          {running && continueRef.current ? (
            <Button variant="destructive" onClick={stop}>Stop</Button>
          ) : (
            <Button variant="secondary" onClick={handleAll} disabled={running || !user}>
              {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Run continuously
            </Button>
          )}
          <Button variant="outline" onClick={fetchRemaining} disabled={running}>Refresh count</Button>
        </div>

        {updated > 0 && remaining !== null && <Progress value={pct} />}

        <div className="rounded-md border border-yellow-500/30 bg-yellow-500/5 p-3 flex gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            If most videos fail with "frame capture failed (CORS or codec)", your S3 bucket needs CORS
            enabled to allow <code>GET</code> from this origin. Without it, the browser cannot read
            video pixels for thumbnail extraction.
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Recent results</p>
          <ScrollArea className="h-[320px] border rounded-md p-2">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3">No results yet. Run a batch to start generating thumbnails.</p>
            ) : (
              <ul className="space-y-2">
                {recent.map((r, i) => (
                  <li key={i} className="text-sm border-b border-border/50 pb-2 flex items-start gap-2">
                    {r.status === 'updated' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {r.thumbnail_url && (
                          <img src={r.thumbnail_url} alt="" className="w-16 h-10 object-cover rounded shrink-0" loading="lazy" />
                        )}
                        <span className="text-xs text-muted-foreground break-all">{r.id}</span>
                      </>
                    ) : (
                      <span className="text-xs text-destructive">
                        {r.status}: {r.reason} ({r.id.slice(0, 8)})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
