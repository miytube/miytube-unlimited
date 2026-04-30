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
}

interface Result {
  id: string;
  status: 'updated' | 'error' | 'skipped';
  thumbnail_url?: string;
  reason?: string;
}

const SEEK_SECONDS = 1.5;

/**
 * Loads a video element, seeks to ~1.5s, draws the frame to a canvas,
 * and returns a JPEG Blob. Resolves to null on failure.
 */
function captureFrame(videoUrl: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    let settled = false;

    const finish = (blob: Blob | null) => {
      if (settled) return;
      settled = true;
      try { video.removeAttribute('src'); video.load(); } catch { /* ignore */ }
      resolve(blob);
    };

    const timeout = window.setTimeout(() => finish(null), 25_000);

    video.addEventListener('error', () => { window.clearTimeout(timeout); finish(null); });
    video.addEventListener('loadedmetadata', () => {
      const target = Math.min(SEEK_SECONDS, Math.max(0.1, (video.duration || 2) * 0.1));
      try { video.currentTime = target; } catch { finish(null); }
    });
    video.addEventListener('seeked', () => {
      try {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (!w || !h) return finish(null);
        // Cap at 640px wide for compact JPEGs
        const scale = Math.min(1, 640 / w);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return finish(null);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((b) => { window.clearTimeout(timeout); finish(b); }, 'image/jpeg', 0.78);
      } catch {
        finish(null);
      }
    });

    video.src = videoUrl;
  });
}

export const ThumbnailGeneratorManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [batchSize, setBatchSize] = useState(10);
  const [running, setRunning] = useState(false);
  const continueRef = useRef(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [updated, setUpdated] = useState(0);
  const [errors, setErrors] = useState(0);
  const [recent, setRecent] = useState<Result[]>([]);

  const fetchRemaining = async () => {
    const { count } = await supabase
      .from('uploaded_videos')
      .select('id', { count: 'exact', head: true })
      .eq('is_cloud_stored', true)
      .is('thumbnail_url', null);
    setRemaining(count ?? 0);
  };

  useEffect(() => { fetchRemaining(); }, []);

  const processOne = async (row: VideoRow): Promise<Result> => {
    const src = row.cloud_url || row.video_url;
    if (!src) return { id: row.id, status: 'skipped', reason: 'no video url' };

    const blob = await captureFrame(src);
    if (!blob) return { id: row.id, status: 'error', reason: 'frame capture failed (CORS or codec)' };

    // Upload under the admin's own folder so RLS allows it
    const path = `${user!.id}/auto/${row.id}.jpg`;
    const { error: upErr } = await supabase.storage
      .from('thumbnails')
      .upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    if (upErr) return { id: row.id, status: 'error', reason: `upload: ${upErr.message}` };

    const { data: pub } = supabase.storage.from('thumbnails').getPublicUrl(path);
    const thumbUrl = pub.publicUrl;

    const { error: dbErr } = await supabase
      .from('uploaded_videos')
      .update({ thumbnail_url: thumbUrl })
      .eq('id', row.id);
    if (dbErr) return { id: row.id, status: 'error', reason: `db: ${dbErr.message}` };

    return { id: row.id, status: 'updated', thumbnail_url: thumbUrl };
  };

  const runBatch = async (): Promise<{ updated: number; errors: number; processed: number }> => {
    const { data, error } = await supabase
      .from('uploaded_videos')
      .select('id, title, cloud_url, video_url')
      .eq('is_cloud_stored', true)
      .is('thumbnail_url', null)
      .order('created_at', { ascending: false })
      .limit(batchSize);
    if (error) throw error;

    const rows = (data || []) as VideoRow[];
    let u = 0; let e = 0;
    const results: Result[] = [];
    for (const r of rows) {
      const res = await processOne(r);
      results.push(res);
      if (res.status === 'updated') u++;
      else if (res.status === 'error') e++;
    }
    setRecent((prev) => [...results, ...prev].slice(0, 60));
    setUpdated((n) => n + u);
    setErrors((n) => n + e);
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
                          <img src={r.thumbnail_url} alt="thumb" className="w-16 h-10 object-cover rounded shrink-0" loading="lazy" />
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
