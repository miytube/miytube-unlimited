import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign, Target, Megaphone, Calendar, Image, CreditCard, Star } from 'lucide-react';
import { CampaignCheckout } from './CampaignCheckout';
import { BannerAdPreview } from './BannerAdPreview';

const AD_FORMATS = [
  { id: 'discovery', name: 'Discovery Ad', description: 'Appears in search results and homepage', price: '$0.01/view' },
  { id: 'skippable_instream', name: 'Skippable In-stream', description: 'Plays before videos, skippable after 5s', price: '$0.02/view' },
  { id: 'non_skippable_instream', name: 'Non-skippable In-stream', description: '15-20 second mandatory ad', price: '$0.03/view' },
  { id: 'bumper', name: 'Bumper Ad', description: '6-second non-skippable ad', price: '$0.015/view' },
  { id: 'banner', name: 'Banner Ad', description: 'Display banner on pages', price: '$0.005/impression' },
  { id: 'overlay', name: 'Overlay Ad', description: 'Semi-transparent overlay on videos', price: '$0.008/view' },
  { id: 'vignette', name: 'Vignette Wallpaper', description: 'Full-page background takeover (image or video) on desktop', price: '$0.012/impression' },
];

const CATEGORIES = [
  'Music', 'Comedy', 'Sports', 'Education', 'Gaming', 'News',
  'Entertainment', 'Science', 'Technology', 'Travel', 'Film',
  'Fitness', 'Food', 'Animals', 'Fashion', 'Documentary',
];

const CTA_OPTIONS = ['Learn More', 'Shop Now', 'Sign Up', 'Watch Now', 'Download', 'Get Offer', 'Book Now', 'Contact Us'];

type PricingChoice =
  | { kind: 'tier'; priceId: 'ad_starter_10' | 'ad_growth_50' | 'ad_enterprise_500'; amount: number; label: string }
  | { kind: 'custom'; amount: number }
  | { kind: 'package'; amount: number };

const TIERS: Array<Extract<PricingChoice, { kind: 'tier' }> & { recommended?: boolean; features: string[] }> = [
  { kind: 'tier', priceId: 'ad_starter_10', amount: 10, label: 'Starter', features: ['Discovery ads', 'Basic targeting', 'Up to 1,000 views/day'] },
  { kind: 'tier', priceId: 'ad_growth_50', amount: 50, label: 'Growth', recommended: true, features: ['All ad formats', 'Advanced targeting', 'Up to 10,000 views/day', 'Priority placement'] },
  { kind: 'tier', priceId: 'ad_enterprise_500', amount: 500, label: 'Enterprise', features: ['Premium placement', 'Unlimited views', 'Dedicated account manager', 'A/B testing'] },
];

// Launch promo: first 30 days from launch date get discounted pricing (already ~20%+ below
// competitor rates). After promo ends, prices auto-revert to the normal column.
const LAUNCH_PROMO_END = new Date('2026-08-22T23:59:59Z');
const isPromoActive = () => new Date() <= LAUNCH_PROMO_END;

type AdPlacement = 'watch' | 'homepage' | 'preroll';

type FixedPackage = {
  id: string;
  label: string;
  placement: AdPlacement;
  days: number;
  normalPrice: number;
  launchPrice: number;
  blurb: string;
  highlight?: string;
};

const FIXED_PACKAGES: FixedPackage[] = [
  { id: 'watch_7d',  label: '7-Day Watch Banner',  placement: 'watch',    days: 7,  normalPrice: 200,  launchPrice: 160,  blurb: 'Banner below every video player for 7 days.' },
  { id: 'watch_14d', label: '14-Day Watch Banner', placement: 'watch',    days: 14, normalPrice: 350,  launchPrice: 280,  blurb: 'Two full weeks below every video player.' },
  { id: 'watch_30d', label: '30-Day Watch Banner', placement: 'watch',    days: 30, normalPrice: 600,  launchPrice: 480,  blurb: 'A full month on every watch page.', highlight: 'Best value' },
  { id: 'home_24h',  label: '24-Hour Homepage Takeover', placement: 'homepage', days: 1,  normalPrice: 2500, launchPrice: 1500, blurb: 'Full 24-hour exclusive top-of-homepage banner.', highlight: 'Launch deal' },
  { id: 'home_7d',   label: '7-Day Homepage Banner',     placement: 'homepage', days: 7,  normalPrice: 2000, launchPrice: 1600, blurb: 'Homepage rotation slot for a full week.' },
  { id: 'home_30d',  label: '30-Day Homepage Banner',    placement: 'homepage', days: 30, normalPrice: 6000, launchPrice: 4800, blurb: 'Month-long premium homepage presence.' },
];

// Pre-roll video ads play inside the player, before the viewer's video starts.
const PREROLL_PACKAGES: FixedPackage[] = [
  { id: 'preroll_7d',  label: '7-Day Pre-Roll',  placement: 'preroll', days: 7,  normalPrice: 450,  launchPrice: 360,  blurb: 'Your video ad plays before videos across MiyTube for 7 days.' },
  { id: 'preroll_14d', label: '14-Day Pre-Roll', placement: 'preroll', days: 14, normalPrice: 800,  launchPrice: 640,  blurb: 'Two weeks of in-stream video ads before playback.' },
  { id: 'preroll_30d', label: '30-Day Pre-Roll', placement: 'preroll', days: 30, normalPrice: 1400, launchPrice: 1120, blurb: 'A full month of in-stream video ads.', highlight: 'Best value' },
];

const PREROLL_FORMATS = ['skippable_instream', 'non_skippable_instream', 'bumper'];


interface CreateAdFormProps {
  onSuccess?: () => void;
}

export const CreateAdForm: React.FC<CreateAdFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [campaignName, setCampaignName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [adFormat, setAdFormat] = useState('discovery');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [callToAction, setCallToAction] = useState('Learn More');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [targetCategories, setTargetCategories] = useState<string[]>([]);
  const [dailyBudget, setDailyBudget] = useState('10.00');
  const [customTotalBudget, setCustomTotalBudget] = useState('100.00');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [pricingKind, setPricingKind] = useState<'package' | 'tier' | 'custom'>('package');
  const [selectedTier, setSelectedTier] = useState<typeof TIERS[number]>(TIERS[1]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(FIXED_PACKAGES[2].id);
  const [placement, setPlacement] = useState<'watch' | 'homepage'>('watch');
  const [campaignType, setCampaignType] = useState<'display' | 'preroll'>('display');
  const [newCampaignId, setNewCampaignId] = useState<string | null>(null);

  const isPreroll = campaignType === 'preroll';
  const availablePackages = isPreroll ? PREROLL_PACKAGES : FIXED_PACKAGES;
  const availableFormats = isPreroll
    ? AD_FORMATS.filter(f => PREROLL_FORMATS.includes(f.id))
    : AD_FORMATS.filter(f => !PREROLL_FORMATS.includes(f.id));

  // Pre-roll campaigns are sold only as fixed-duration in-stream packages.
  const effectivePricingKind = isPreroll ? 'package' : pricingKind;

  const selectedPackage =
    availablePackages.find(p => p.id === selectedPackageId) ?? availablePackages[availablePackages.length - 1];
  const promoActive = isPromoActive();
  const packagePrice = promoActive ? selectedPackage.launchPrice : selectedPackage.normalPrice;

  const switchCampaignType = (next: 'display' | 'preroll') => {
    setCampaignType(next);
    if (next === 'preroll') {
      setAdFormat('skippable_instream');
      setSelectedPackageId(PREROLL_PACKAGES[PREROLL_PACKAGES.length - 1].id);
      setPricingKind('package');
    } else {
      setAdFormat('discovery');
      setSelectedPackageId(FIXED_PACKAGES[2].id);
    }
  };

  const pricing: PricingChoice =
    effectivePricingKind === 'package'
      ? { kind: 'package', amount: packagePrice }
      : effectivePricingKind === 'tier'
      ? selectedTier
      : { kind: 'custom', amount: parseFloat(customTotalBudget) || 0 };

  // Packages already bake in placement pricing; tier/custom keep the 5× homepage multiplier.
  const placementMultiplier = effectivePricingKind === 'package' ? 1 : (placement === 'homepage' ? 5 : 1);
  const effectivePlacement: AdPlacement =
    effectivePricingKind === 'package' ? selectedPackage.placement : placement;
  const finalAmount = pricing.amount * placementMultiplier;



  const toggleCategory = (cat: string) => {
    setTargetCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const isSafeHttpUrl = (raw: string): boolean => {
    try {
      const u = new URL(raw.trim());
      return u.protocol === 'https:' || u.protocol === 'http:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to create an ad campaign.', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    if (!campaignName.trim() || !businessName.trim() || !headline.trim() || !destinationUrl.trim()) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    if (!isSafeHttpUrl(destinationUrl)) {
      toast({ title: 'Invalid destination URL', description: 'Destination URL must start with https:// or http://', variant: 'destructive' });
      return;
    }
    if (businessWebsite.trim() && !isSafeHttpUrl(businessWebsite)) {
      toast({ title: 'Invalid business website', description: 'Business website must start with https:// or http://', variant: 'destructive' });
      return;
    }
    if (adFormat === 'vignette' && !mediaUrl.trim()) {
      toast({ title: 'Wallpaper media required', description: 'Vignette ads need an image or video URL.', variant: 'destructive' });
      return;
    }
    if (isPreroll && !mediaUrl.trim()) {
      toast({ title: 'Ad video required', description: 'Pre-roll campaigns need a hosted video URL (.mp4/.webm).', variant: 'destructive' });
      return;
    }

    if (mediaUrl.trim() && !isSafeHttpUrl(mediaUrl)) {
      toast({ title: 'Invalid media URL', description: 'Media URL must start with https:// or http://', variant: 'destructive' });
      return;
    }
    if (pricing.amount < 10) {
      toast({ title: 'Invalid budget', description: 'Minimum budget is $10.00', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      // For fixed-duration packages, auto-compute end_date = start_date + days - 1
      let resolvedEndDate: string | null = endDate || null;
      if (effectivePricingKind === 'package') {
        const start = new Date(startDate + 'T00:00:00Z');
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + selectedPackage.days - 1);
        resolvedEndDate = end.toISOString().split('T')[0];
      }

      const { data, error } = await supabase
        .from('ad_campaigns')
        .insert({
          user_id: user.id,
          campaign_name: campaignName.trim(),
          business_name: businessName.trim(),
          business_website: businessWebsite.trim() || null,
          ad_format: adFormat as any,
          headline: headline.trim(),
          description: description.trim() || null,
          call_to_action: callToAction,
          destination_url: destinationUrl.trim(),
          media_url: mediaUrl.trim() || null,
          target_audience: targetAudience.trim() || null,
          target_categories: targetCategories,
          daily_budget: parseFloat(dailyBudget) || 10,
          total_budget: finalAmount,
          placement: effectivePlacement,
          start_date: startDate,
          end_date: resolvedEndDate,
          status: 'pending_payment' as any,
          payment_status: 'unpaid',
          site: getCurrentSiteId(),
        } as any)

        .select('id')
        .single();

      if (error) throw error;
      setNewCampaignId(data!.id as string);
      setStep(5);
      toast({ title: 'Campaign saved', description: 'Complete payment to submit it for review.' });
    } catch (err: any) {
      console.error('Ad creation error:', err);
      toast({ title: 'Error', description: err.message || 'Failed to create campaign.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFormat = AD_FORMATS.find(f => f.id === adFormat);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map(s => (
          <React.Fragment key={s}>
            <button
              onClick={() => (s < 5 || newCampaignId) && setStep(s)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === s ? 'bg-primary text-primary-foreground' : step > s ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </button>
            {s < 5 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Campaign Details</h3>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Campaign Name *</label>
            <Input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g. Summer Sale Promo" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Name *</label>
            <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your business name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Website</label>
            <Input value={businessWebsite} onChange={e => setBusinessWebsite(e.target.value)} placeholder="https://yourbusiness.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Campaign Type *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => switchCampaignType('display')}
                className={`p-3 rounded-lg border text-left transition-all ${!isPreroll ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
              >
                <div className="font-medium text-sm">Display / Banner Campaign</div>
                <div className="text-xs text-muted-foreground mt-1">Banners and wallpapers on homepage and watch pages.</div>
              </button>
              <button
                type="button"
                onClick={() => switchCampaignType('preroll')}
                className={`p-3 rounded-lg border text-left transition-all ${isPreroll ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
              >
                <div className="font-medium text-sm">Pre-Roll Video Campaign</div>
                <div className="text-xs text-muted-foreground mt-1">Your video ad plays inside the player before the viewer's video.</div>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ad Format *</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {availableFormats.map(fmt => (
                <button
                  key={fmt.id}
                  onClick={() => setAdFormat(fmt.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    adFormat === fmt.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-sm">{fmt.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{fmt.description}</div>
                  <div className="text-xs text-primary font-medium mt-1">{fmt.price}</div>
                </button>
              ))}
            </div>
          </div>
          <Button onClick={() => setStep(2)} className="w-full" disabled={!campaignName.trim() || !businessName.trim()}>Next: Creative</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4"><Image className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Ad Creative</h3></div>
          <div>
            <label className="block text-sm font-medium mb-1">Headline * (max 90 chars)</label>
            <Input value={headline} onChange={e => setHeadline(e.target.value.slice(0, 90))} placeholder="Catchy headline for your ad" />
            <span className="text-xs text-muted-foreground">{headline.length}/90</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 500))} placeholder="Tell viewers about your product or service" className="w-full p-2 rounded-md border bg-background min-h-[80px]" />
            <span className="text-xs text-muted-foreground">{description.length}/500</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Call to Action</label>
            <Select value={callToAction} onValueChange={setCallToAction}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CTA_OPTIONS.map(cta => <SelectItem key={cta} value={cta}>{cta}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination URL *</label>
            <Input value={destinationUrl} onChange={e => setDestinationUrl(e.target.value)} placeholder="https://yourbusiness.com/landing-page" />
          </div>
          {isPreroll && (
            <div>
              <label className="block text-sm font-medium mb-1">Ad Video URL * <span className="text-xs text-muted-foreground font-normal">(.mp4 or .webm)</span></label>
              <Input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="https://yourcdn.com/ad-15s.mp4" />
              <p className="text-xs text-muted-foreground mt-1">
                {adFormat === 'bumper'
                  ? 'Bumper ads must be 6 seconds or shorter.'
                  : adFormat === 'non_skippable_instream'
                  ? 'Non-skippable ads should be 15–20 seconds.'
                  : 'Skippable ads can be any length — viewers can skip after 5 seconds.'}{' '}
                Recommended 1920×1080, H.264/AAC MP4.
              </p>
            </div>
          )}
          {adFormat === 'vignette' && (

            <div>
              <label className="block text-sm font-medium mb-1">Wallpaper Media URL * <span className="text-xs text-muted-foreground font-normal">(image or .mp4/.webm video)</span></label>
              <Input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="https://yourcdn.com/wallpaper.jpg" />
              <p className="text-xs text-muted-foreground mt-1">Recommended: 1920×1080 or larger. Keep important content centered — the middle ~1400px is covered by the page.</p>
            </div>
          )}
          {adFormat === 'banner' && (
            <div>
              <label className="block text-sm font-medium mb-1">Banner Image URL <span className="text-xs text-muted-foreground font-normal">(optional — we auto-generate a banner from your text if empty)</span></label>
              <Input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="https://yourcdn.com/banner.jpg" />
              <p className="text-xs text-muted-foreground mt-1">Recommended: 1200×628. Leave blank to use an auto-generated colored banner with your business initials.</p>
            </div>
          )}

          {/* Live preview */}
          <div className="pt-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Live preview</div>
            <BannerAdPreview
              headline={headline}
              description={description}
              businessName={businessName}
              callToAction={callToAction}
              mediaUrl={mediaUrl}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Approved banner ads appear at the top of the MiyTube homepage and directly below the video player on Watch pages.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
            <Button onClick={() => setStep(3)} className="flex-1" disabled={!headline.trim() || !destinationUrl.trim()}>Next: Targeting</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4"><Target className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Audience Targeting</h3></div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience Description</label>
            <Input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="e.g. Young professionals interested in tech" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Target Categories</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1 rounded-full text-sm transition-colors ${targetCategories.includes(cat) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
            <Button onClick={() => setStep(4)} className="flex-1">Next: Budget</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4"><DollarSign className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Choose Your Budget</h3></div>

          {/* Placement chooser — hidden for fixed packages (baked into the package) */}
          {effectivePricingKind !== 'package' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Where should your ad appear? *</label>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlacement('watch')}
                  className={`text-left p-4 rounded-lg border transition-all ${placement === 'watch' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50'}`}
                >
                  <div className="font-semibold">Watch pages</div>
                  <div className="text-xs text-muted-foreground mt-1">Below the video player on every watch page.</div>
                  <div className="text-xs text-primary font-medium mt-2">Base price</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPlacement('homepage')}
                  className={`relative text-left p-4 rounded-lg border transition-all ${placement === 'homepage' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50'}`}
                >
                  <span className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">Premium</span>
                  <div className="font-semibold">Homepage banner</div>
                  <div className="text-xs text-muted-foreground mt-1">Top of the MiyTube homepage — highest traffic slot.</div>
                  <div className="text-xs text-primary font-medium mt-2">5× the base price</div>
                </button>
              </div>
            </div>
          )}

          <div className={`flex gap-2 p-1 bg-muted rounded-lg ${isPreroll ? 'hidden' : ''}`}>
            <button
              onClick={() => setPricingKind('package')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${effectivePricingKind === 'package' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
            >Fixed-duration packages</button>
            <button
              onClick={() => setPricingKind('tier')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${effectivePricingKind === 'tier' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
            >Tiers</button>
            <button
              onClick={() => setPricingKind('custom')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${effectivePricingKind === 'custom' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
            >Custom budget</button>
          </div>

          {effectivePricingKind === 'package' && (
            <>
              {promoActive && (
                <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 text-sm">
                  <span className="font-semibold text-primary">Launch offer active:</span>{' '}
                  Save up to 40% on every package through{' '}
                  <strong>{LAUNCH_PROMO_END.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
                  Prices auto-return to normal after that.
                </div>
              )}
              <div className="grid md:grid-cols-3 gap-3">
                {availablePackages.map(p => {
                  const price = promoActive ? p.launchPrice : p.normalPrice;
                  const showStrike = promoActive && p.launchPrice < p.normalPrice;
                  const isSelected = selectedPackageId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPackageId(p.id)}
                      className={`relative text-left p-4 rounded-lg border transition-all ${
                        isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {p.highlight && (
                        <span className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                          {p.highlight}
                        </span>
                      )}
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {p.placement === 'homepage' ? 'Homepage' : p.placement === 'preroll' ? 'Pre-roll (in-stream)' : 'Watch pages'} · {p.days === 1 ? '24 hours' : `${p.days} days`}
                      </div>
                      <div className="font-semibold mt-1">{p.label}</div>
                      <div className="flex items-baseline gap-2 my-1">
                        <span className="text-2xl font-bold text-primary">${price.toLocaleString()}</span>
                        {showStrike && (
                          <span className="text-sm text-muted-foreground line-through">${p.normalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.blurb}</p>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Fixed packages auto-set your end date. All packages are priced at least 20% below comparable Meta, LinkedIn and YouTube slots.
              </p>
            </>
          )}

          {effectivePricingKind === 'tier' && (
            <div className="grid md:grid-cols-3 gap-3">
              {TIERS.map(t => (
                <button
                  key={t.priceId}
                  onClick={() => setSelectedTier(t)}
                  className={`relative text-left p-4 rounded-lg border transition-all ${
                    selectedTier.priceId === t.priceId ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  {t.recommended && (
                    <span className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="h-2.5 w-2.5" /> Recommended
                    </span>
                  )}
                  <div className="font-semibold">{t.label}</div>
                  <div className="text-2xl font-bold text-primary my-1">${t.amount}</div>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    {t.features.map(f => <li key={f}>• {f}</li>)}
                  </ul>
                </button>
              ))}
            </div>
          )}

          {effectivePricingKind === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Daily Budget ($) *</label>
                <Input type="number" min="1" step="0.01" value={dailyBudget} onChange={e => setDailyBudget(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Budget ($) * <span className="text-xs text-muted-foreground">min $10</span></label>
                <Input type="number" min="10" step="0.01" value={customTotalBudget} onChange={e => setCustomTotalBudget(e.target.value)} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> Start Date *</label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> End Date {effectivePricingKind === 'package' && <span className="text-xs text-muted-foreground font-normal">(auto)</span>}</label>
              <Input
                type="date"
                value={endDate}
                disabled={effectivePricingKind === 'package'}
                onChange={e => setEndDate(e.target.value)}
                placeholder={effectivePricingKind === 'package' ? 'Auto-set by package' : ''}
              />
              {effectivePricingKind === 'package' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Runs for {selectedPackage.days === 1 ? '24 hours' : `${selectedPackage.days} days`} from your start date.
                </p>
              )}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium">Campaign Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Campaign:</span><span>{campaignName}</span>
              <span className="text-muted-foreground">Format:</span><span>{selectedFormat?.name}</span>
              <span className="text-muted-foreground">Placement:</span>
              <span>
                {effectivePlacement === 'homepage'
                  ? (effectivePricingKind === 'package' ? 'Homepage' : 'Homepage (Premium 5×)')
                  : effectivePlacement === 'preroll'
                  ? 'Pre-roll before videos'
                  : 'Watch pages'}
              </span>
              <span className="text-muted-foreground">Plan:</span>
              <span>
                {effectivePricingKind === 'package'
                  ? `${selectedPackage.label}${promoActive ? ' (launch price)' : ''}`
                  : effectivePricingKind === 'tier' ? selectedTier.label : 'Custom'}
              </span>
              {effectivePricingKind === 'package' && (
                <>
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{selectedPackage.days === 1 ? '24 hours' : `${selectedPackage.days} days`}</span>
                </>
              )}
              <span className="text-muted-foreground">Base price:</span><span>${pricing.amount.toFixed(2)}</span>
              {effectivePricingKind !== 'package' && placement === 'homepage' && (
                <>
                  <span className="text-muted-foreground">Homepage multiplier:</span>
                  <span>× 5</span>
                </>
              )}
              <span className="text-muted-foreground">Total to charge:</span>
              <span className="font-semibold text-primary">${finalAmount.toFixed(2)}</span>
              <span className="text-muted-foreground">Categories:</span><span>{targetCategories.join(', ') || 'All'}</span>
            </div>
          </div>


          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting || pricing.amount < 10}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
              {isSubmitting ? 'Saving...' : `Continue to Payment ($${finalAmount.toFixed(2)})`}
            </Button>
          </div>
        </div>
      )}

      {step === 5 && newCampaignId && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Complete Payment</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Charging <strong>${finalAmount.toFixed(2)}</strong> for your campaign. Card details are handled securely — MiyTube never sees them.
          </p>
          <CampaignCheckout
            campaignId={newCampaignId}
            mode="initial"
            priceId={effectivePricingKind === 'tier' && placement === 'watch' ? (pricing as any).priceId : undefined}
            customAmountCents={
              effectivePricingKind === 'package' || effectivePricingKind === 'custom' || placement === 'homepage'
                ? Math.round(finalAmount * 100)
                : undefined
            }
          />


          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            <span>Ref: {newCampaignId.slice(0, 8)}</span>
            <button onClick={() => { onSuccess?.(); navigate('/advertising'); }} className="underline">Pay later</button>
          </div>
        </div>
      )}
    </div>
  );
};
