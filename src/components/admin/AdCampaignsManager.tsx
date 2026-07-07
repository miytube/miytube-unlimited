import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, MessageSquareWarning, ExternalLink } from "lucide-react";
import { getStripeEnvironment } from "@/lib/stripe";

interface Campaign {
  id: string;
  campaign_name: string;
  business_name: string;
  business_website: string | null;
  ad_format: string;
  headline: string;
  description: string | null;
  destination_url: string | null;
  status: string;
  payment_status: string;
  total_budget: number;
  amount_spent: number;
  refunded_amount: number;
  media_url: string | null;
  created_at: string;
  user_id: string;
  rejection_reason: string | null;
  admin_notes: string | null;
  dispute_status: string | null;
}

type Action = "approve" | "reject" | "request_changes";

export default function AdCampaignsManager() {
  const { toast } = useToast();
  const [tab, setTab] = useState("pending_review");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<{ c: Campaign; action: Action } | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("ad_campaigns").select("*").order("created_at", { ascending: false });
    if (tab === "pending_review") q = q.eq("status", "pending_review");
    else if (tab === "active") q = q.eq("status", "active");
    else if (tab === "rejected") q = q.eq("status", "rejected");
    else if (tab === "disputed") q = q.not("dispute_status", "is", null);
    const { data, error } = await q;
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setCampaigns((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const submit = async () => {
    if (!dialog) return;
    if (dialog.action !== "approve" && !reason.trim()) {
      toast({ title: "Reason required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-review-campaign", {
        body: {
          campaignId: dialog.c.id,
          action: dialog.action,
          reason: reason.trim() || undefined,
          environment: getStripeEnvironment(),
        },
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      toast({
        title: dialog.action === "approve" ? "Approved" : dialog.action === "reject" ? "Rejected & refunded" : "Sent back to advertiser",
        description: dialog.action === "reject" ? `Refunded $${Number(data.refunded || 0).toFixed(2)}` : undefined,
      });
      setDialog(null);
      setReason("");
      load();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const openDialog = (c: Campaign, action: Action) => {
    setDialog({ c, action });
    setReason("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Campaign Review</CardTitle>
        <CardDescription>Review paid campaigns, approve or reject with refund, or request changes from the advertiser.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="pending_review">Pending Review</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="disputed">Disputes</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="mt-4">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : campaigns.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nothing here.</p>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div key={c.id} className="border rounded-lg p-4 space-y-2 bg-card">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold">{c.campaign_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {c.business_name} · {c.ad_format.replace(/_/g, " ")} · ${Number(c.total_budget).toFixed(2)} budget
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge>{c.status.replace(/_/g, " ")}</Badge>
                        {c.dispute_status && <Badge variant="destructive">{c.dispute_status}</Badge>}
                      </div>
                    </div>
                    <p className="text-sm italic">"{c.headline}"</p>
                    {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
                    {c.destination_url && (
                      <a href={c.destination_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline inline-flex items-center gap-1">
                        {c.destination_url} <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {c.media_url && (
                      <img src={c.media_url} alt="ad creative" className="max-h-32 rounded border" />
                    )}
                    {c.rejection_reason && (
                      <p className="text-xs text-red-600">Rejection reason: {c.rejection_reason}</p>
                    )}
                    {c.admin_notes && (
                      <p className="text-xs text-muted-foreground">Notes: {c.admin_notes}</p>
                    )}
                    {tab === "pending_review" && (
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={() => openDialog(c, "approve")}>
                          <Check className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openDialog(c, "request_changes")}>
                          <MessageSquareWarning className="h-3 w-3 mr-1" /> Request changes
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => openDialog(c, "reject")}>
                          <X className="h-3 w-3 mr-1" /> Reject & refund
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={!!dialog} onOpenChange={(o) => { if (!o) { setDialog(null); setReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog?.action === "approve" && "Approve campaign"}
              {dialog?.action === "reject" && "Reject & refund"}
              {dialog?.action === "request_changes" && "Request changes"}
            </DialogTitle>
            <DialogDescription>
              {dialog?.action === "approve" && "This campaign will go live immediately and the advertiser will be notified."}
              {dialog?.action === "reject" && "The full unspent balance will be refunded to the advertiser's card and status set to rejected."}
              {dialog?.action === "request_changes" && "The campaign returns to draft. The advertiser must re-submit and re-pay."}
            </DialogDescription>
          </DialogHeader>
          {dialog?.action !== "approve" && (
            <Textarea
              placeholder="Reason (shown to advertiser)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          )}
          {dialog?.action === "approve" && (
            <Textarea
              placeholder="Internal notes (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(null)}>Cancel</Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
