import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { extractVideoFrames } from '@/utils/extractVideoFrames';

interface RunResult {
  id: string;
  status: 'updated' | 'error' | 'skipped';
  old_title?: string;
  title?: string;
  category?: string;
  subcategory?: string;
  error?: string;
  reason?: string;
  confidence?: number;
  frames_used?: number;
}

const FILENAME_FILTER = [
  'title.ilike.%.480p',
  'title.ilike.%.360p',
  'title.ilike.%.720p',
  'title.ilike.%.1080p',
  'title.ilike.%.mob',
  'title.ilike.%.mp4',
  'title.ilike.%.webm',
  'title.ilike.%.mov',
  'title.ilike.upload-%',
].join(',');

export const AIAutoTitleManager = () => {
  const { toast } = useToast();
  const [batchSize, setBatchSize] = useState(100);
  const [running, setRunning] = useState(false);
  const [continuous, setContinuous] = useState(false);
  const continuousRef = useRef(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [totalUpdated, setTotalUpdated] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [recent, setRecent] = useState<RunResult[]>([]);
  const [smartMode, setSmartMode] = useState(true);
  const [framesPerVideo, setFramesPerVideo] = useState(5);
  const [phase, setPhase] = useState<string>('');

  const fetchRemaining = async () => {
    const { count } = await supabase
      .from('uploaded_videos')
      .select('id', { count: 'exact', head: true })
      .eq('is_cloud_stored', true)
      .or(FILENAME_FILTER);
    setRemaining(count ?? 0);
  };

  useEffect(() => { fetchRemaining(); }, []);

  // Legacy server-side: server picks rows and uses single thumbnail.
  const runLegacyBatch = async (): Promise<{ updated: number; errors: number; processed: number }> => {
    setPhase('Calling AI on thumbnails…');
    const { data, error } = await supabase.functions.invoke('ai-auto-title', {
      body: { batch_size: batchSize },
    });
    if (error) throw error;
    const results: RunResult[] = data?.results || [];
    setRecent((prev) => [...results, ...prev].slice(0, 100));
    setTotalUpdated((n) => n + (data?.updated || 0));
    setTotalErrors((n) => n + (data?.errors || 0));
    return {
      updated: data?.updated || 0,
      errors: data?.errors || 0,
      processed: data?.processed || 0,
    };
  };

  // Smart: pull a batch, extract frames per video in the browser, post frames to AI.
  const runSmartBatch = async (): Promise<{ updated: number; errors: number; processed: number }> => {
    setPhase('Loading batch…');
    const { data: rows, error } = await supabase
      .from('uploaded_videos')
      .select('id, title, cloud_url, video_url, thumbnail_url')
      .eq('is_cloud_stored', true)
      .or(FILENAME_FILTER)
      .order('created_at', { ascending: false })
      .limit(Math.min(batchSize, 25)); // smaller per-call so we stay under edge timeout

    if (error) throw error;
    if (!rows || rows.length === 0) {
      setPhase('');
      return { updated: 0, errors: 0, processed: 0 };
    }

    const videos: { id: string; filename: string; frames: string[] }[] = [];
    let errors = 0;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i] as any;
      setPhase(`Extracting frames ${i + 1}/${rows.length}…`);
      const url = r.cloud_url || r.video_url;
      if (!url) {
        errors++;
        setRecent((p) => [{ id: r.id, status: 'error' as const, error: 'no video url' }, ...p].slice(0, 100));
        continue;
      }
      try {
        const frames = await extractVideoFrames(url, { count: framesPerVideo });
        if (frames.length === 0) {
          errors++;
          setRecent((p) => [{ id: r.id, status: 'skipped' as const, reason: 'no frames extracted' }, ...p].slice(0, 100));
          continue;
        }
        videos.push({ id: r.id, filename: r.title || '', frames });
      } catch (e: any) {
        errors++;
        setRecent((p) => [{ id: r.id, status: 'error' as const, error: `extract: ${e?.message || e}` }, ...p].slice(0, 100));
      }
    }

    if (videos.length === 0) {
      setTotalErrors((n) => n + errors);
      setPhase('');
      return { updated: 0, errors, processed: rows.length };
    }

    setPhase(`Calling AI on ${videos.length} videos × ${framesPerVideo} frames…`);
    const { data, error: fnErr } = await supabase.functions.invoke('ai-auto-title', {
      body: { videos },
    });
    if (fnErr) throw fnErr;
    const results: RunResult[] = data?.results || [];
    setRecent((prev) => [...results, ...prev].slice(0, 100));
    setTotalUpdated((n) => n + (data?.updated || 0));
    setTotalErrors((n) => n + (data?.errors || 0) + errors);
    setPhase('');
    return {
      updated: data?.updated || 0,
      errors: (data?.errors || 0) + errors,
      processed: rows.length,
    };
  };

  const runBatch = () => (smartMode ? runSmartBatch() : runLegacyBatch());

  const handleRunOne = async () => {
    setRunning(true);
    try {
      const r = await runBatch();
      toast({ title: 'Batch complete', description: `Updated ${r.updated} • Errors ${r.errors}` });
      await fetchRemaining();
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message, variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  const handleRunAll = async () => {
    setRunning(true);
    setContinuous(true);
    continuousRef.current = true;
    try {
      while (continuousRef.current) {
        const r = await runBatch();
        await fetchRemaining();
        if (r.processed === 0) break;
        if (!continuousRef.current) break;
        // small breather between batches
        await new Promise((res) => setTimeout(res, 1500));
      }
      toast({
        title: continuousRef.current ? 'All done' : 'Stopped',
        description: continuousRef.current
          ? 'No more videos need titling.'
          : 'Continuous run stopped.',
      });
    } catch (e: any) {
      toast({ title: 'Stopped', description: e.message, variant: 'destructive' });
    } finally {
      continuousRef.current = false;
      setRunning(false);
      setContinuous(false);
    }
  };

  const stop = () => {
    continuousRef.current = false;
    setContinuous(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Auto-Title Videos
        </CardTitle>
        <CardDescription>
          Uses AI vision to generate real titles, categories, and descriptions for videos that still
          have raw filename titles (e.g. <code>9c3c744d…480p</code>). Continuous mode keeps pulling
          batches until none remain.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold">{remaining?.toLocaleString() ?? '…'}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-muted-foreground">Updated this session</p>
            <p className="text-2xl font-bold text-green-500">{totalUpdated}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-muted-foreground">Errors</p>
            <p className="text-2xl font-bold text-destructive">{totalErrors}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Switch id="smart" checked={smartMode} onCheckedChange={setSmartMode} disabled={running} />
            <Label htmlFor="smart" className="cursor-pointer">
              Smart mode (multi-frame)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground flex-1 min-w-[200px]">
            {smartMode
              ? `Samples ${framesPerVideo} frames per video so the AI sees start, middle, and end — far fewer mislabeled videos.`
              : 'Legacy: uses only the thumbnail (frame 0). Faster but often wrong.'}
          </p>
          {smartMode && (
            <div className="max-w-[120px]">
              <Label htmlFor="frames" className="text-xs">Frames / video</Label>
              <Input
                id="frames"
                type="number"
                min={3}
                max={6}
                value={framesPerVideo}
                onChange={(e) => setFramesPerVideo(Math.max(3, Math.min(6, Number(e.target.value) || 5)))}
                disabled={running}
              />
            </div>
          )}
        </div>

        {phase && (
          <p className="text-xs text-muted-foreground italic">{phase}</p>
        )}


        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 max-w-[180px]">
            <Label htmlFor="batch">Batch size (1-100)</Label>
            <Input
              id="batch"
              type="number"
              min={1}
              max={100}
              value={batchSize}
              onChange={(e) => setBatchSize(Math.max(1, Math.min(100, Number(e.target.value) || 100)))}
              disabled={running}
            />
          </div>
          <Button onClick={handleRunOne} disabled={running}>
            {running && !continuous ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Run one batch
          </Button>
          {continuous ? (
            <Button variant="destructive" onClick={stop}>Stop</Button>
          ) : (
            <Button variant="secondary" onClick={handleRunAll} disabled={running}>
              {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Run continuously
            </Button>
          )}
          <Button variant="outline" onClick={fetchRemaining} disabled={running}>Refresh count</Button>
        </div>

        {remaining !== null && remaining > 0 && totalUpdated > 0 && (
          <Progress value={(totalUpdated / (totalUpdated + remaining)) * 100} />
        )}

        <div>
          <p className="text-sm font-semibold mb-2">Recent results</p>
          <ScrollArea className="h-[320px] border rounded-md p-2">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3">No results yet. Run a batch to see AI-generated titles here.</p>
            ) : (
              <ul className="space-y-2">
                {recent.map((r, i) => (
                  <li key={i} className="text-sm border-b border-border/50 pb-2">
                    {r.status === 'updated' ? (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">{r.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.category} → {r.subcategory || '—'}
                            {typeof r.confidence === 'number' && (
                              <span className={r.confidence >= 0.7 ? 'text-green-500' : r.confidence >= 0.5 ? 'text-yellow-500' : 'text-destructive'}>
                                {' '}• {Math.round(r.confidence * 100)}% conf
                              </span>
                            )}
                            {r.frames_used ? <> • {r.frames_used} frames</> : null}
                            {r.old_title ? <> • was: <code>{r.old_title.slice(0, 40)}</code></> : null}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-destructive">
                        {r.status}: {r.error || r.reason} ({r.id.slice(0, 8)})
                      </p>
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
