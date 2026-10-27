import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Check, Eye, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSiteId } from '@/config/sites';
import { CampaignCheckout } from '@/components/advertising/CampaignCheckout';
import { HERO_PACKAGES, getHeroPackage, heroEndDate, type HeroPackageId } from '@/lib/heroSponsorPackages';

const url = z.string().trim().url('Must be a full link starting with https://').max(500)
  .refine((v) => /^https?:\/\//i.test(v), 'Must start with https://');

const schema = z.object({
  businessName: z.string().trim().min(1, 'Business name is required').max(100),
  headline: z.string().trim().min(1, 'Headline is required').max(90),
  description: z.string().trim().max(200).optional(),
  destinationUrl: url,
  mediaUrl: url.optional().or(z.literal('')),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const fmt = (cents: number) => `$${(cents / 100).toLocaleString()}`;

export default function SponsorHomepage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const [pkgId, setPkgId] = useState<HeroPackageId>('hero_7d');
  const [form, setForm] = useState({ businessName: '', headline: '', description: '', destinationUrl: '', mediaUrl: '', startDate: today });
  const [busy, setBusy] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  useEffect(() => { document.title = 'Sponsor the MiyTube Homepage — Book & Pay Online'; }, []);

  const pkg = getHeroPackage(pkgId)!;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!user) {
      toast({ title: 'Sign in to book', description: 'Create a free account so we can send your receipt and results.' });
      navigate('/auth');
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: 'Check your details', description: parsed.error.issues[0].message, variant: 'destructive' });
      return;
    }
    const v = parsed.data;
    setBusy(true);
    try {
      const { data, error } = await supabase.from('ad_campaigns').insert({
        user_id: user.id,
        campaign_name: `${pkg.label} — ${v.businessName}`,
        business_name: v.businessName,
        ad_format: 'banner',
        headline: v.headline,
        description: v.description || null,
        call_to_action: 'Learn More',
        destination_url: v.destinationUrl,
        media_url: v.mediaUrl || null,
        daily_budget: Math.round(pkg.priceCents / pkg.days) / 100,
        total_budget: pkg.priceCents / 100,
        placement: 'homepage',
        start_date: v.startDate,
        end_date: heroEndDate(v.startDate, pkg.days),
        status: 'pending_payment',
        payment_status: 'unpaid',
        admin_notes: `Homepage hero package: ${pkg.id}`,
        site: getCurrentSiteId(),
      } as any).select('id').single();
      if (error) throw error;
      setCampaignId(data!.id as string);
    } catch (e: any) {
      toast({ title: 'Could not start booking', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
          <Megaphone size={16} /> Homepage Hero Sponsor
        </p>
        <h1 className="text-3xl font-bold md:text-4xl">Put your brand in the first spot every visitor sees.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          No calls, no meetings. Pick a package, add your ad, pay online. We check it for content rules and it goes live on your start date.
        </p>
      </header>

      {campaignId ? (
        <section className="rounded-xl border bg-card p-4 md:p-6">
          <h2 className="mb-1 text-xl font-semibold">Pay {fmt(pkg.priceCents)} — {pkg.label}</h2>
          <p className="mb-4 text-sm text-muted-foreground">Secure card payment. Your receipt arrives by email.</p>
          <CampaignCheckout campaignId={campaignId} packageId={pkg.id} mode="initial" />
        </section>
      ) : (
        <>
          <section className="mb-10 grid gap-4 md:grid-cols-3">
            {HERO_PACKAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPkgId(p.id)}
                className={`relative rounded-xl border p-5 text-left transition-all ${pkgId === p.id ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-border hover:border-primary/50'}`}
              >
                {p.highlight && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">{p.highlight}</span>
                )}
                <div className="text-sm font-medium text-muted-foreground">{p.label}</div>
                <div className="my-1 text-3xl font-bold">{fmt(p.priceCents)}</div>
                <p className="text-sm text-muted-foreground">{p.blurb}</p>
                {pkgId === p.id && <Check className="absolute bottom-4 right-4 text-primary" size={18} />}
              </button>
            ))}
          </section>

          <section className="grid gap-8 md:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div><Label htmlFor="bn">Business name *</Label><Input id="bn" maxLength={100} value={form.businessName} onChange={set('businessName')} /></div>
              <div><Label htmlFor="hl">Headline *</Label><Input id="hl" maxLength={90} placeholder="e.g. Grand opening — 20% off this week" value={form.headline} onChange={set('headline')} /></div>
              <div><Label htmlFor="ds">Short description</Label><Textarea id="ds" maxLength={200} value={form.description} onChange={set('description')} /></div>
              <div><Label htmlFor="du">Where should clicks go? *</Label><Input id="du" placeholder="https://yourbusiness.com" value={form.destinationUrl} onChange={set('destinationUrl')} /></div>
              <div><Label htmlFor="mu">Image or video link</Label><Input id="mu" placeholder="https://… (.jpg, .png, .mp4)" value={form.mediaUrl} onChange={set('mediaUrl')} /></div>
              <div><Label htmlFor="sd">Start date *</Label><Input id="sd" type="date" min={today} value={form.startDate} onChange={set('startDate')} /></div>
            </div>

            <aside className="h-fit rounded-xl border bg-muted/40 p-5">
              <h3 className="font-semibold">Your booking</h3>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Package</dt><dd>{pkg.label}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Runs</dt><dd>{form.startDate} → {heroEndDate(form.startDate || today, pkg.days)}</dd></div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold"><dt>Total</dt><dd>{fmt(pkg.priceCents)}</dd></div>
              </dl>
              <Button className="mt-4 w-full" onClick={submit} disabled={busy}>
                {busy ? 'Saving…' : user ? 'Continue to payment' : 'Sign in & continue'}
              </Button>
              <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                <Eye size={14} className="mt-0.5 shrink-0" /> Track views and clicks anytime in your ad dashboard.
              </p>
              <Link to="/advertise" className="mt-2 block text-xs text-muted-foreground underline">Prefer to talk first? Contact us</Link>
            </aside>
          </section>
        </>
      )}
    </main>
  );
}
