import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RunResult {
  video_id: string;
  status: 'created' | 'error';
  title?: string;
  slug?: string;
  error?: string;
}

export const BatchArticleGenerator = () => {
  const { toast } = useToast();
  const [batchSize, setBatchSize] = useState(5);
  const [publish, setPublish] = useState(true);
  const [continuous, setContinuous] = useState(false);
  const continuousRef = useRef(false);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [totalCreated, setTotalCreated] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [recent, setRecent] = useState<RunResult[]>([]);

  const fetchRemaining = async () => {
    const { data, error } = await supabase.functions.invoke('batch-generate-articles', {
      body: { mode: 'count' },
    });
    if (error || data?.error) return;
    setRemaining(data?.remaining ?? 0);
  };

  useEffect(() => {
    fetchRemaining();
  }, []);

  const runBatch = async () => {
    const { data, error } = await supabase.functions.invoke('batch-generate-articles', {
      body: { batch_size: batchSize, publish },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    const results: RunResult[] = data?.results || [];
    setRecent((prev) => [...results, ...prev].slice(0, 100));
    setTotalCreated((n) => n + (data?.created || 0));
    setTotalErrors((n) => n + (data?.errors || 0));
    setRemaining(data?.remaining ?? null);
    return { created: data?.created || 0, remaining: data?.remaining ?? 0 };
  };

  const start = async () => {
    setRunning(true);
    continuousRef.current = continuous;
    try {
      do {
        const { created, remaining: left } = await runBatch();
        if (!continuousRef.current || created === 0 || left <= 0) break;
      } while (continuousRef.current);
      toast({ title: 'Batch complete', description: 'Articles generated from your videos.' });
    } catch (err: any) {
      toast({
        title: 'Batch failed',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      continuousRef.current = false;
      setRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Batch SEO Article Generator
        </CardTitle>
        <CardDescription>
          Turn existing videos into search-friendly articles (title, meta description, FAQ, and a link
          back to the video). Videos that already have a generated article are skipped.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="batch-size">Videos per batch (1-15)</Label>
            <Input
              id="batch-size"
              type="number"
              min={1}
              max={15}
              value={batchSize}
              onChange={(e) => setBatchSize(Math.min(15, Math.max(1, Number(e.target.value) || 1)))}
              disabled={running}
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch id="publish" checked={publish} onCheckedChange={setPublish} disabled={running} />
            <Label htmlFor="publish">Publish immediately</Label>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="continuous"
              checked={continuous}
              onCheckedChange={setContinuous}
              disabled={running}
            />
            <Label htmlFor="continuous">Keep going until done</Label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>Videos without an article: <strong>{remaining ?? '—'}</strong></span>
          <span>Created this session: <strong>{totalCreated}</strong></span>
          <span>Errors: <strong>{totalErrors}</strong></span>
        </div>

        <div className="flex gap-2">
          <Button onClick={start} disabled={running}>
            {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {running ? 'Generating…' : 'Generate articles'}
          </Button>
          <Button variant="outline" onClick={fetchRemaining} disabled={running}>
            Refresh count
          </Button>
          {running && continuousRef.current && (
            <Button variant="ghost" onClick={() => { continuousRef.current = false; }}>
              Stop after this batch
            </Button>
          )}
        </div>

        {recent.length > 0 && (
          <ScrollArea className="h-72 rounded-md border p-3">
            <ul className="space-y-2 text-sm">
              {recent.map((r, i) => (
                <li key={`${r.video_id}-${i}`} className="flex items-start gap-2">
                  {r.status === 'created' ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.title || r.video_id}</p>
                    {r.status === 'created' ? (
                      <a className="text-xs text-muted-foreground hover:underline" href={`/blog/${r.slug}`}>
                        /blog/{r.slug}
                      </a>
                    ) : (
                      <p className="text-xs text-destructive">{r.error}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
