import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Loader2 } from 'lucide-react';

// Public pricing references (USD, us-east-1 / Supabase Pro)
// S3 Standard storage: $0.023 / GB-month
// S3 egress to internet: $0.09 / GB (first 10 TB)
// Supabase storage: $0.021 / GB-month (after 100 GB included on Pro)
// Supabase egress: $0.09 / GB (after 250 GB included)
const S3_STORAGE = 0.023;
const S3_EGRESS = 0.09;
const SUPA_STORAGE = 0.021;
const SUPA_EGRESS = 0.09;
const SUPA_STORAGE_INCLUDED_GB = 100;
const SUPA_EGRESS_INCLUDED_GB = 250;
// Assume average viewer watches ~40% of a video before bouncing
const AVG_WATCH_RATIO = 0.4;

interface Totals {
  total_videos: number;
  on_s3: number;
  on_supabase: number;
  total_gb: number;
  s3_gb: number;
  supabase_gb: number;
  total_views: number;
}

const fmt = (n: number) => `$${n.toFixed(2)}`;

export const StorageCostEstimate = () => {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState<Totals | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Pull only needed columns. 5k rows is fine.
        const { data, error } = await supabase
          .from('uploaded_videos')
          .select('cloud_url, file_size, views')
          .limit(20000);
        if (error) throw error;
        const rows = data || [];
        const t: Totals = {
          total_videos: rows.length,
          on_s3: 0,
          on_supabase: 0,
          total_gb: 0,
          s3_gb: 0,
          supabase_gb: 0,
          total_views: 0,
        };
        for (const r of rows as any[]) {
          const size = Number(r.file_size || 0);
          const gb = size / (1024 ** 3);
          t.total_gb += gb;
          t.total_views += Number(r.views || 0);
          const u: string = r.cloud_url || '';
          if (u.includes('amazonaws') || u.includes('.s3.')) {
            t.on_s3++;
            t.s3_gb += gb;
          } else if (u.includes('supabase.co/storage')) {
            t.on_supabase++;
            t.supabase_gb += gb;
          }
        }
        setTotals(t);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Calculating storage costs…
        </CardContent>
      </Card>
    );
  }
  if (!totals) return null;

  const avgSizeGb = totals.total_videos > 0 ? totals.total_gb / totals.total_videos : 0;
  // Monthly egress estimate: views × avg size × watch ratio
  const monthlyEgressGb = totals.total_views * avgSizeGb * AVG_WATCH_RATIO;

  // Current Supabase-only world (everything on Supabase)
  const supaStorageBillable = Math.max(0, totals.total_gb - SUPA_STORAGE_INCLUDED_GB);
  const supaEgressBillable = Math.max(0, monthlyEgressGb - SUPA_EGRESS_INCLUDED_GB);
  const supaOnlyMonthly = supaStorageBillable * SUPA_STORAGE + supaEgressBillable * SUPA_EGRESS;

  // All-on-S3 world
  const s3OnlyMonthly = totals.total_gb * S3_STORAGE + monthlyEgressGb * S3_EGRESS;

  // Current split (real)
  const curSupaStorageBillable = Math.max(0, totals.supabase_gb - SUPA_STORAGE_INCLUDED_GB);
  // assume views distribute proportional to storage
  const supaEgressShare = totals.total_gb > 0 ? (totals.supabase_gb / totals.total_gb) * monthlyEgressGb : 0;
  const s3EgressShare = totals.total_gb > 0 ? (totals.s3_gb / totals.total_gb) * monthlyEgressGb : 0;
  const curMonthly =
    curSupaStorageBillable * SUPA_STORAGE +
    Math.max(0, supaEgressShare - SUPA_EGRESS_INCLUDED_GB) * SUPA_EGRESS +
    totals.s3_gb * S3_STORAGE +
    s3EgressShare * S3_EGRESS;

  const remainingGb = totals.supabase_gb;
  const fullyMigratedSavings = supaOnlyMonthly - s3OnlyMonthly;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-5 w-5" />
          Storage Cost Estimate
        </CardTitle>
        <CardDescription>
          Rough monthly cost based on current sizes and view counts. Assumes viewers stream ~
          {Math.round(AVG_WATCH_RATIO * 100)}% of each video on average.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Total videos" value={totals.total_videos.toLocaleString()} />
          <Stat label="Total size" value={`${totals.total_gb.toFixed(1)} GB`} />
          <Stat label="On Supabase" value={`${totals.on_supabase} · ${totals.supabase_gb.toFixed(1)} GB`} />
          <Stat label="On AWS S3" value={`${totals.on_s3} · ${totals.s3_gb.toFixed(1)} GB`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <CostCard
            title="If 100% on Supabase"
            cost={supaOnlyMonthly}
            sub={`${totals.total_gb.toFixed(0)} GB storage + ${monthlyEgressGb.toFixed(0)} GB egress/mo`}
          />
          <CostCard
            title="Current split (real)"
            cost={curMonthly}
            sub={`${totals.on_s3} on S3, ${totals.on_supabase} on Supabase`}
            highlight
          />
          <CostCard
            title="If 100% on AWS S3"
            cost={s3OnlyMonthly}
            sub={`${totals.total_gb.toFixed(0)} GB storage + ${monthlyEgressGb.toFixed(0)} GB egress/mo`}
          />
        </div>

        <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-1">
          <div>
            <strong>{remainingGb.toFixed(1)} GB</strong> still on Supabase ({totals.on_supabase} videos).
            Migrating all of it would change your monthly bill by{' '}
            <strong className={fullyMigratedSavings >= 0 ? 'text-green-600' : 'text-red-600'}>
              {fullyMigratedSavings >= 0 ? '−' : '+'}
              {fmt(Math.abs(fullyMigratedSavings))}/mo
            </strong>
            .
          </div>
          <div className="text-muted-foreground">
            Pricing assumed: S3 ${S3_STORAGE}/GB storage, ${S3_EGRESS}/GB egress · Supabase $
            {SUPA_STORAGE}/GB storage after {SUPA_STORAGE_INCLUDED_GB} GB, ${SUPA_EGRESS}/GB egress after{' '}
            {SUPA_EGRESS_INCLUDED_GB} GB. Real bills vary with plan, region, and CDN.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border p-2">
    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
);

const CostCard = ({
  title,
  cost,
  sub,
  highlight,
}: {
  title: string;
  cost: number;
  sub: string;
  highlight?: boolean;
}) => (
  <div className={`rounded-md border p-3 ${highlight ? 'border-primary bg-primary/5' : ''}`}>
    <div className="text-xs text-muted-foreground">{title}</div>
    <div className="text-2xl font-bold">{fmt(cost)}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
    <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
  </div>
);
