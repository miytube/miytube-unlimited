import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Clock, Loader2, Mail, RefreshCw, Ban, Trash2, ShieldCheck } from 'lucide-react';

interface AccountRow {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
  banned: boolean;
  channel_name: string | null;
  role: string;
}

export const AccountsManager = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [onlyPending, setOnlyPending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('admin-manage-users', {
      body: { action: 'list' },
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Could not load accounts', description: error.message, variant: 'destructive' });
      return;
    }
    setAccounts((data?.users ?? []) as AccountRow[]);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (action: string, id: string, successMsg: string) => {
    setBusyId(id);
    const { data, error } = await supabase.functions.invoke('admin-manage-users', {
      body: { action, target_user_id: id, redirect_to: `${window.location.origin}/` },
    });
    setBusyId(null);
    if (error || data?.error) {
      toast({
        title: 'Action failed',
        description: data?.error ?? error?.message,
        variant: 'destructive',
      });
      return;
    }
    toast({ title: successMsg });
    load();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return accounts.filter((a) => {
      if (onlyPending && a.email_confirmed) return false;
      if (!q) return true;
      return a.email.toLowerCase().includes(q) || (a.channel_name ?? '').toLowerCase().includes(q);
    });
  }, [accounts, search, onlyPending]);

  const pendingCount = accounts.filter((a) => !a.email_confirmed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" /> Accounts &amp; Registration Status
        </CardTitle>
        <CardDescription>
          Accounts stay pending until the person confirms their signup email. Approve them here, resend the email, or remove the account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search by email or channel"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button variant={onlyPending ? 'default' : 'outline'} size="sm" onClick={() => setOnlyPending((v) => !v)}>
            <Clock className="h-4 w-4 mr-1" />
            Pending only ({pendingCount})
          </Button>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No accounts match this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Last sign in</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.email}</TableCell>
                    <TableCell>{a.channel_name || '—'}</TableCell>
                    <TableCell>
                      {a.banned ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : a.email_confirmed ? (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {a.last_sign_in_at ? new Date(a.last_sign_in_at).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {!a.email_confirmed && (
                          <>
                            <Button
                              size="sm"
                              disabled={busyId === a.id}
                              onClick={() => runAction('confirm', a.id, 'Account approved')}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busyId === a.id}
                              onClick={() => runAction('resend', a.id, 'Confirmation email sent')}
                            >
                              <Mail className="h-4 w-4 mr-1" /> Resend
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === a.id}
                          onClick={() => runAction(a.banned ? 'unban' : 'ban', a.id, a.banned ? 'Account restored' : 'Account suspended')}
                        >
                          <Ban className="h-4 w-4 mr-1" /> {a.banned ? 'Restore' : 'Suspend'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busyId === a.id}
                          onClick={() => {
                            if (confirm(`Permanently delete ${a.email}?`)) {
                              runAction('delete', a.id, 'Account deleted');
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountsManager;
