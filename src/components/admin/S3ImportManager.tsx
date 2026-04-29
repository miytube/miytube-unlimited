import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, Download, DownloadCloud } from 'lucide-react';

interface S3Item { key: string; size: number; lastModified: string; }

function inferCategory(key: string) {
  const parts = key.split('/');
  if (parts.length < 2) return { category: 'Uncategorized', subcategory: '' };
  return { category: parts[0], subcategory: parts.length >= 3 ? parts[1] : '' };
}

export const S3ImportManager = () => {
  const { toast } = useToast();
  const [prefix, setPrefix] = useState('');
  const [items, setItems] = useState<S3Item[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [nextToken, setNextToken] = useState<string | undefined>();

  const load = async (token?: string, append = false) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('s3-import', {
        body: { action: 'list', prefix, continuation_token: token },
      });
      if (error) throw error;
      setItems(append ? [...items, ...(data.items ?? [])] : data.items ?? []);
      setNextToken(data.nextToken);
      if (!append) setSelected(new Set());
    } catch (e: any) {
      toast({ title: 'List failed', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key: string) => {
    const s = new Set(selected);
    s.has(key) ? s.delete(key) : s.add(key);
    setSelected(s);
  };

  const toggleAll = () => {
    setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i.key)));
  };

  const importSelected = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    try {
      const keys = Array.from(selected);
      const { data, error } = await supabase.functions.invoke('s3-import', {
        body: { action: 'import', keys },
      });
      if (error) throw error;
      const imported = data.results.filter((r: any) => r.status === 'imported').length;
      const skipped = data.results.filter((r: any) => r.status === 'skipped').length;
      const failed = data.results.filter((r: any) => r.status === 'error').length;
      toast({
        title: 'Import complete',
        description: `${imported} imported, ${skipped} skipped, ${failed} failed`,
      });
      setSelected(new Set());
    } catch (e: any) {
      toast({ title: 'Import failed', description: e.message, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  const importAll = async () => {
    setImporting(true);
    let totalImported = 0, totalSkipped = 0, totalFailed = 0, totalScanned = 0;
    try {
      let token: string | undefined = undefined;
      do {
        const { data: listData, error: listErr } = await supabase.functions.invoke('s3-import', {
          body: { action: 'list', prefix, continuation_token: token },
        });
        if (listErr) throw listErr;
        const pageItems: S3Item[] = listData.items ?? [];
        totalScanned += pageItems.length;

        // Import in chunks of 25 to avoid edge function timeouts
        const chunkSize = 25;
        for (let i = 0; i < pageItems.length; i += chunkSize) {
          const chunk = pageItems.slice(i, i + chunkSize).map((it) => it.key);
          const { data: impData, error: impErr } = await supabase.functions.invoke('s3-import', {
            body: { action: 'import', keys: chunk },
          });
          if (impErr) throw impErr;
          totalImported += impData.results.filter((r: any) => r.status === 'imported').length;
          totalSkipped += impData.results.filter((r: any) => r.status === 'skipped').length;
          totalFailed += impData.results.filter((r: any) => r.status === 'error').length;
          toast({
            title: 'Importing...',
            description: `${totalImported} imported · ${totalSkipped} skipped · ${totalFailed} failed (of ${totalScanned} scanned)`,
          });
        }
        token = listData.nextToken;
      } while (token);

      toast({
        title: 'Import All complete',
        description: `${totalImported} imported, ${totalSkipped} skipped, ${totalFailed} failed`,
      });
      await load();
    } catch (e: any) {
      toast({ title: 'Import All failed', description: e.message, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>S3 Import (miytube bucket)</CardTitle>
        <CardDescription>
          Browse your AWS S3 bucket and bulk-import videos. Categories are auto-derived from folder paths
          (e.g. <code>music/rock/song.mp4</code> → category <code>music</code>, subcategory <code>rock</code>).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Folder prefix (optional, e.g. music/)"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
          <Button onClick={() => load()} disabled={loading || importing}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Load</span>
          </Button>
          <Button onClick={importAll} disabled={loading || importing} variant="secondary">
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <DownloadCloud className="h-4 w-4" />}
            <span className="ml-2">Import All</span>
          </Button>
        </div>

        {items.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {items.length} video files · {selected.size} selected
              </p>
              <Button onClick={importSelected} disabled={selected.size === 0 || importing}>
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                <span className="ml-2">Import {selected.size > 0 ? `(${selected.size})` : ''}</span>
              </Button>
            </div>

            <div className="border rounded-md max-h-[500px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selected.size === items.length && items.length > 0}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const { category, subcategory } = inferCategory(item.key);
                    return (
                      <TableRow key={item.key}>
                        <TableCell>
                          <Checkbox
                            checked={selected.has(item.key)}
                            onCheckedChange={() => toggle(item.key)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">{item.key}</TableCell>
                        <TableCell className="text-xs">
                          {category}{subcategory ? ` / ${subcategory}` : ''}
                        </TableCell>
                        <TableCell className="text-xs">
                          {(item.size / 1024 / 1024).toFixed(1)} MB
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {nextToken && (
              <Button variant="outline" onClick={() => load(nextToken, true)} disabled={loading}>
                Load more
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
