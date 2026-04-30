import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

interface RunResult {
  id: string;
  status: 'updated' | 'error' | 'skipped';
  old_title?: string;
  title?: string;
  category?: string;
  subcategory?: string;
  error?: string;
  reason?: string;
}

export const AIAutoTitleManager = () => {
  const { toast } = useToast();
  const [batchSize, setBatchSize] = useState(10);
  const [running, setRunning] = useState(false);
  const [continuous, setContinuous] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [totalUpdated, setTotalUpdated] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [recent, setRecent] = useState<RunResult[]>([]);

  const fetchRemaining = async () => {
    const { count } = await supabase
      .from('uploaded_videos')
      .select('id', { count: 'exact', head: true })
      .eq('is_cloud_stored', true)
      .or('title.ilike.%.480p,title.ilike.%.360p,title.ilike.%.720p,title.ilike.%.1080p');
    setRemaining(count ?? 0);
  };

  useEffect(() => { fetchRemaining(); }, []);

  const runBatch = async (): Promise<{ updated: number; errors: number; processed: number }> => {
    const { data, error } = await supabase.functions.invoke('ai-auto-title', {
      body: { batch_size: batchSize },
    });
    if (error) throw error;
    const results: RunResult[] = data?.results || [];
    setRecent((prev) => [...results, ...prev].slice(0, 50));
    setTotalUpdated((n) => n + (data?.updated || 0));
    setTotalErrors((n) => n + (data?.errors || 0));
    return {
      updated: data?.updated || 0,
      errors: data?.errors || 0,
      processed: data?.processed || 0,
    };
  };

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
    try {
      while (true) {
        const r = await runBatch();
        await fetchRemaining();
        if (r.processed === 0) break;
        if (!continuous && r.processed > 0) { /* still continuing */ }
        // small breather between batches
        await new Promise((res) => setTimeout(res, 1500));
      }
      toast({ title: 'All done', description: 'No more videos need titling.' });
    } catch (e: any) {
      toast({ title: 'Stopped', description: e.message, variant: 'destructive' });
    } finally {
      setRunning(false);
      setContinuous(false);
    }
  };

  const stop = () => setContinuous(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Auto-Title Videos
        </CardTitle>
        <CardDescription>
          Uses AI vision to generate real titles, categories, and descriptions for videos that still
          have raw filename titles (e.g. <code>9c3c744d…480p</code>).
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

        <div className="flex items-end gap-3">
          <div className="flex-1 max-w-[180px]">
            <Label htmlFor="batch">Batch size (1-25)</Label>
            <Input
              id="batch"
              type="number"
              min={1}
              max={25}
              value={batchSize}
              onChange={(e) => setBatchSize(Math.max(1, Math.min(25, Number(e.target.value) || 10)))}
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
                            {r.category} → {r.subcategory} • was: <code>{r.old_title?.slice(0, 50)}</code>
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
