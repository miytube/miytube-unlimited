import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, MousePointerClick, BarChart3, Pause, Play, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  impressions: number;
  clicks: number;
  views: number;
  ctr: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
  payment_status: string;
}

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending_payment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
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

  const fetchCampaigns = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('ad_campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
    } else {
      setCampaigns((data as any[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, [user]);

  const togglePause = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const { error } = await supabase
      .from('ad_campaigns')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "Failed to update campaign.", variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Campaign ${newStatus === 'active' ? 'resumed' : 'paused'}.` });
      fetchCampaigns();
    }
  };

  const deleteCampaign = async (id: string) => {
    const { error } = await supabase
      .from('ad_campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "Only draft campaigns can be deleted.", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Campaign removed." });
      fetchCampaigns();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
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
    <div className="space-y-4">
      {campaigns.map(campaign => (
        <div key={campaign.id} className="bg-card rounded-lg border p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{campaign.campaign_name}</h3>
              <p className="text-sm text-muted-foreground">{campaign.business_name} · {campaign.ad_format.replace(/_/g, ' ')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[campaign.status] || ''}>
                {campaign.status.replace(/_/g, ' ')}
              </Badge>
              {campaign.payment_status === 'unpaid' && campaign.status === 'pending_payment' && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  Awaiting Payment
                </Badge>
              )}
            </div>
          </div>

          <p className="text-sm italic">"{campaign.headline}"</p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-2 bg-muted/50 rounded">
              <Eye className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <div className="text-lg font-bold">{campaign.impressions.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Impressions</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <MousePointerClick className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <div className="text-lg font-bold">{campaign.clicks.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Clicks</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <BarChart3 className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <div className="text-lg font-bold">{(Number(campaign.ctr) * 100).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">CTR</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold">${Number(campaign.amount_spent).toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">of ${Number(campaign.total_budget).toFixed(2)}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {(campaign.status === 'active' || campaign.status === 'paused') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => togglePause(campaign.id, campaign.status)}
              >
                {campaign.status === 'active' ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                {campaign.status === 'active' ? 'Pause' : 'Resume'}
              </Button>
            )}
            {campaign.status === 'draft' && (
              <Button variant="destructive" size="sm" onClick={() => deleteCampaign(campaign.id)}>
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
