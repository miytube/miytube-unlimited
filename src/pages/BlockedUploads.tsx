import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ShieldAlert, Download } from 'lucide-react';

type BlockedRow = {
  id: string;
  file_name: string;
  file_size: number | null;
  title: string | null;
  category: string | null;
  subcategory: string | null;
  reason: string;
  details: string | null;
  created_at: string;
};

const reasonLabel = (r: string) => {
  switch (r) {
    case 'duplicate_file': return 'Duplicate file';
    case 'duplicate_session': return 'Already in this session';
    case 'incompatible_format': return 'Incompatible format';
    default: return r;
  }
};

const formatSize = (b: number | null) => {
  if (!b) return '—';
  return `${(b / 1048576).toFixed(1)} MB`;
};

const BlockedUploads: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<BlockedRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blocked_uploads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (error) {
      toast({ title: 'Failed to load', description: error.message, variant: 'destructive' });
    } else {
      setRows((data ?? []) as BlockedRow[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteOne = async (id: string) => {
    const { error } = await supabase.from('blocked_uploads').delete().eq('id', id);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const clearAll = async () => {
    if (!confirm(`Clear all ${rows.length} blocked-upload records?`)) return;
    const ids = rows.map((r) => r.id);
    const { error } = await supabase.from('blocked_uploads').delete().in('id', ids);
    if (error) {
      toast({ title: 'Clear failed', description: error.message, variant: 'destructive' });
      return;
    }
    setRows([]);
  };

  const downloadCsv = () => {
    const header = 'created_at,reason,file_name,size_mb,title,category,subcategory,details\n';
    const body = rows.map((r) => [
      r.created_at,
      reasonLabel(r.reason),
      r.file_name,
      r.file_size ? (r.file_size / 1048576).toFixed(1) : '',
      r.title ?? '',
      r.category ?? '',
      r.subcategory ?? '',
      (r.details ?? '').replace(/"/g, '""'),
    ].map((v) => `"${String(v)}"`).join(',')).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blocked_uploads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <ShieldAlert className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Blocked Uploads</h1>
          <p className="text-muted-foreground ml-2">
            Files the uploader rejected (duplicates, invalid formats). Use this to see exactly what was skipped.
          </p>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadCsv} disabled={rows.length === 0}>
              <Download size={16} className="mr-1" /> Export CSV
            </Button>
            <Button variant="destructive" size="sm" onClick={clearAll} disabled={rows.length === 0}>
              Clear all
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground">No blocked uploads recorded.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Reason</th>
                  <th className="px-3 py-2">File</th>
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Target</th>
                  <th className="px-3 py-2">Details</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/20">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 font-medium">{reasonLabel(r.reason)}</td>
                    <td className="px-3 py-2 break-all">{r.file_name}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatSize(r.file_size)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {r.category || '—'}{r.subcategory ? ` / ${r.subcategory}` : ''}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{r.details}</td>
                    <td className="px-3 py-2">
                      <Button variant="ghost" size="icon" onClick={() => deleteOne(r.id)} aria-label="Delete record">
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlockedUploads;
