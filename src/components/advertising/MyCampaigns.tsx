import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, MousePointerClick, BarChart3, Pause, Play, Trash2, CreditCard, Plus, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CampaignCheckout } from './CampaignCheckout';

interface Campaign {
  id: string;
  campaign_name: string;
  business_name: string;
  ad_format: string;
  status: string;
  headline: string;
  daily_budget: number;
  total_budget: number;
  amount_spent: number;
  refunded_amount: number;
  impressions: number;
  clicks: number;
  views: number;
  ctr: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
  payment_status: string;
  rejection_reason?: string | null;
  admin_notes?: string | null;
}

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending_payment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  pending_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  paused: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const MyCampaigns: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingCampaign, setPayingCampaign] = useState<Campaign | null>(null);
  const [topupCampaign, setTopupCampaign] = useState<Campaign | null>(null);
  const [topupAmount, setTopupAmount] = useState('25.00');
  const [topupCheckoutId, setTopupCheckoutId] = useState<string | null>(null);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('ad_campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setCampaigns((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, [user]);

  const togglePause = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const { error } = await supabase.from('ad_campaigns').update({ status: newStatus }).eq('id', id);
    if (error) toast({ title: 'Error', description: 'Failed to update campaign.', variant: 'destructive' });
    else { toast({ title: 'Updated', description: `Campaign ${newStatus === 'active' ? 'resumed' : 'paused'}.` }); fetchCampaigns(); }
  };

  const deleteCampaign = async (id: string) => {
    const { error } = await supabase.from('ad_campaigns').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: 'Only draft campaigns can be deleted.', variant: 'destructive' });
    else { toast({ title: 'Deleted', description: 'Campaign removed.' }); fetchCampaigns(); }
  };

  const cancelWithRefund = async (id: string) => {
    if (!confirm('Cancel this campaign and refund the unspent budget? This cannot be undone.')) return;
    setRefundingId(id);
    try {
      const { data, error } = await supabase.functions.invoke('refund-ad-campaign', {
        body: { campaignId: id, environment: (await import('@/lib/stripe')).getStripeEnvironment() },
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      toast({ title: 'Refund issued', description: `$${Number(data.refunded).toFixed(2)} will be returned to your card.` });
      fetchCampaigns();
    } catch (e: any) {
      toast({ title: 'Refund failed', description: e.message, variant: 'destructive' });
    } finally {
      setRefundingId(null);
    }
  };

  const startTopup = (c: Campaign) => {
    setTopupCampaign(c);
    setTopupAmount('25.00');
    setTopupCheckoutId(null);
  };

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-1">No campaigns yet</h3>
        <p className="text-sm text-muted-foreground">Create your first ad campaign to start reaching viewers.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {campaigns.map(campaign => {
          const remaining = Number(campaign.total_budget) - Number(campaign.amount_spent) - Number(campaign.refunded_amount || 0);
          const canRefund = campaign.payment_status === 'paid' && remaining >= 0.5 && campaign.status !== 'completed';
          return (
            <div key={campaign.id} className="bg-card rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{campaign.campaign_name}</h3>
                  <p className="text-sm text-muted-foreground">{campaign.business_name} · {campaign.ad_format.replace(/_/g, ' ')}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Badge className={statusColors[campaign.status] || ''}>{campaign.status.replace(/_/g, ' ')}</Badge>
                  {campaign.payment_status === 'unpaid' && campaign.status === 'pending_payment' && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">Awaiting Payment</Badge>
                  )}
                  {campaign.status === 'pending_review' && (
                    <Badge variant="outline" className="text-blue-600 border-blue-300">Under Review</Badge>
                  )}
                </div>
              </div>

              <p className="text-sm italic">"{campaign.headline}"</p>

              {(campaign as any).rejection_reason && campaign.status === 'rejected' && (
                <div className="text-sm p-2 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200">
                  <strong>Rejected:</strong> {(campaign as any).rejection_reason}
                </div>
              )}
              {(campaign as any).admin_notes && campaign.status === 'draft' && (
                <div className="text-sm p-2 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200">
                  <strong>Changes requested:</strong> {(campaign as any).admin_notes}
                </div>
              )}

              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-2 bg-muted/50 rounded"><Eye className="h-4 w-4 mx-auto text-muted-foreground mb-1" /><div className="text-lg font-bold">{campaign.impressions.toLocaleString()}</div><div className="text-xs text-muted-foreground">Impressions</div></div>
                <div className="text-center p-2 bg-muted/50 rounded"><MousePointerClick className="h-4 w-4 mx-auto text-muted-foreground mb-1" /><div className="text-lg font-bold">{campaign.clicks.toLocaleString()}</div><div className="text-xs text-muted-foreground">Clicks</div></div>
                <div className="text-center p-2 bg-muted/50 rounded"><BarChart3 className="h-4 w-4 mx-auto text-muted-foreground mb-1" /><div className="text-lg font-bold">{(Number(campaign.ctr) * 100).toFixed(1)}%</div><div className="text-xs text-muted-foreground">CTR</div></div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="text-lg font-bold">${Number(campaign.amount_spent).toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">of ${Number(campaign.total_budget).toFixed(2)}</div>
                  {Number(campaign.refunded_amount) > 0 && (
                    <div className="text-[10px] text-green-600 mt-0.5">${Number(campaign.refunded_amount).toFixed(2)} refunded</div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {campaign.payment_status === 'unpaid' && (
                  <Button size="sm" onClick={() => setPayingCampaign(campaign)}>
                    <CreditCard className="h-3 w-3 mr-1" /> Pay ${Number(campaign.total_budget).toFixed(2)}
                  </Button>
                )}
                {(campaign.status === 'active' || campaign.status === 'paused') && (
                  <Button variant="outline" size="sm" onClick={() => togglePause(campaign.id, campaign.status)}>
                    {campaign.status === 'active' ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                    {campaign.status === 'active' ? 'Pause' : 'Resume'}
                  </Button>
                )}
                {campaign.payment_status === 'paid' && ['active', 'paused', 'pending_review'].includes(campaign.status) && (
                  <Button variant="outline" size="sm" onClick={() => startTopup(campaign)}>
                    <Plus className="h-3 w-3 mr-1" /> Add budget
                  </Button>
                )}
                {canRefund && (
                  <Button variant="outline" size="sm" onClick={() => cancelWithRefund(campaign.id)} disabled={refundingId === campaign.id}>
                    {refundingId === campaign.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
                    Cancel & refund ${remaining.toFixed(2)}
                  </Button>
                )}
                {campaign.status === 'draft' && campaign.payment_status === 'paid' && (
                  <Button size="sm" onClick={async () => {
                    const { error } = await supabase.from('ad_campaigns').update({ status: 'pending_review', admin_notes: null }).eq('id', campaign.id);
                    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
                    else { toast({ title: 'Resubmitted', description: 'Campaign sent back for review.' }); fetchCampaigns(); }
                  }}>
                    Resubmit for review
                  </Button>
                )}
                {campaign.status === 'draft' && campaign.payment_status !== 'paid' && (
                  <Button variant="destructive" size="sm" onClick={() => deleteCampaign(campaign.id)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pay dialog */}
      <Dialog open={!!payingCampaign} onOpenChange={(o) => { if (!o) { setPayingCampaign(null); fetchCampaigns(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pay for {payingCampaign?.campaign_name}</DialogTitle>
            <DialogDescription>Charging ${payingCampaign && Number(payingCampaign.total_budget).toFixed(2)} — your campaign goes into review once payment succeeds.</DialogDescription>
          </DialogHeader>
          {payingCampaign && (
            <CampaignCheckout
              campaignId={payingCampaign.id}
              mode="initial"
              customAmountCents={Math.round(Number(payingCampaign.total_budget) * 100)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Top-up dialog */}
      <Dialog open={!!topupCampaign} onOpenChange={(o) => { if (!o) { setTopupCampaign(null); setTopupCheckoutId(null); fetchCampaigns(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add budget to {topupCampaign?.campaign_name}</DialogTitle>
            <DialogDescription>Add funds to keep your campaign running. Minimum $5.00.</DialogDescription>
          </DialogHeader>
          {topupCampaign && !topupCheckoutId && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount ($) *</label>
                <Input type="number" min="5" step="0.01" value={topupAmount} onChange={e => setTopupAmount(e.target.value)} />
              </div>
              <Button
                onClick={() => setTopupCheckoutId(topupCampaign.id)}
                disabled={parseFloat(topupAmount) < 5}
                className="w-full"
              >
                <CreditCard className="h-4 w-4 mr-2" /> Continue to payment (${parseFloat(topupAmount).toFixed(2)})
              </Button>
            </div>
          )}
          {topupCampaign && topupCheckoutId && (
            <CampaignCheckout
              campaignId={topupCampaign.id}
              mode="topup"
              customAmountCents={Math.round(parseFloat(topupAmount) * 100)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
