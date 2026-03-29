import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign, Target, Megaphone, Calendar, Globe, Image } from 'lucide-react';

const AD_FORMATS = [
  { id: 'discovery', name: 'Discovery Ad', description: 'Appears in search results and homepage', price: '$0.01/view' },
  { id: 'skippable_instream', name: 'Skippable In-stream', description: 'Plays before videos, skippable after 5s', price: '$0.02/view' },
  { id: 'non_skippable_instream', name: 'Non-skippable In-stream', description: '15-20 second mandatory ad', price: '$0.03/view' },
  { id: 'bumper', name: 'Bumper Ad', description: '6-second non-skippable ad', price: '$0.015/view' },
  { id: 'banner', name: 'Banner Ad', description: 'Display banner on pages', price: '$0.005/impression' },
  { id: 'overlay', name: 'Overlay Ad', description: 'Semi-transparent overlay on videos', price: '$0.008/view' },
];

const CATEGORIES = [
  'Music', 'Comedy', 'Sports', 'Education', 'Gaming', 'News',
  'Entertainment', 'Science', 'Technology', 'Travel', 'Film',
  'Fitness', 'Food', 'Animals', 'Fashion', 'Documentary',
];

const CTA_OPTIONS = ['Learn More', 'Shop Now', 'Sign Up', 'Watch Now', 'Download', 'Get Offer', 'Book Now', 'Contact Us'];

interface CreateAdFormProps {
  onSuccess?: () => void;
}

export const CreateAdForm: React.FC<CreateAdFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
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
  const [totalBudget, setTotalBudget] = useState('100.00');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const toggleCategory = (cat: string) => {
    setTargetCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to create an ad campaign.", variant: "destructive" });
      navigate('/auth');
      return;
    }

    if (!campaignName.trim() || !businessName.trim() || !headline.trim() || !destinationUrl.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    const budget = parseFloat(totalBudget);
    if (isNaN(budget) || budget < 10) {
      toast({ title: "Invalid budget", description: "Minimum total budget is $10.00", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
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
          target_audience: targetAudience.trim() || null,
          target_categories: targetCategories,
          daily_budget: parseFloat(dailyBudget) || 10,
          total_budget: budget,
          start_date: startDate,
          end_date: endDate || null,
          status: 'pending_payment' as any,
          payment_status: 'unpaid',
        });

      if (error) throw error;

      toast({
        title: "Campaign Created!",
        description: "Your ad campaign has been submitted. Complete payment to activate it.",
      });
      onSuccess?.();
    } catch (err: any) {
      console.error('Ad creation error:', err);
      toast({ title: "Error", description: err.message || "Failed to create campaign.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFormat = AD_FORMATS.find(f => f.id === adFormat);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map(s => (
          <React.Fragment key={s}>
            <button
              onClick={() => setStep(s)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === s ? 'bg-primary text-primary-foreground' : step > s ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </button>
            {s < 4 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Business Info */}
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
            <label className="block text-sm font-medium mb-1">Ad Format *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {AD_FORMATS.map(fmt => (
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

          <Button onClick={() => setStep(2)} className="w-full" disabled={!campaignName.trim() || !businessName.trim()}>
            Next: Creative
          </Button>
        </div>
      )}

      {/* Step 2: Creative */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Ad Creative</h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Headline * (max 90 chars)</label>
            <Input value={headline} onChange={e => setHeadline(e.target.value.slice(0, 90))} placeholder="Catchy headline for your ad" />
            <span className="text-xs text-muted-foreground">{headline.length}/90</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 500))}
              placeholder="Tell viewers about your product or service"
              className="w-full p-2 rounded-md border bg-background min-h-[80px]"
            />
            <span className="text-xs text-muted-foreground">{description.length}/500</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Call to Action</label>
            <Select value={callToAction} onValueChange={setCallToAction}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CTA_OPTIONS.map(cta => (
                  <SelectItem key={cta} value={cta}>{cta}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Destination URL *</label>
            <Input value={destinationUrl} onChange={e => setDestinationUrl(e.target.value)} placeholder="https://yourbusiness.com/landing-page" />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
            <Button onClick={() => setStep(3)} className="flex-1" disabled={!headline.trim() || !destinationUrl.trim()}>
              Next: Targeting
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Targeting */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Audience Targeting</h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target Audience Description</label>
            <Input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="e.g. Young professionals interested in tech" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Categories</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    targetCategories.includes(cat) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
            <Button onClick={() => setStep(4)} className="flex-1">Next: Budget & Payment</Button>
          </div>
        </div>
      )}

      {/* Step 4: Budget & Payment */}
      {step === 4 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Budget & Schedule</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Daily Budget ($) *</label>
              <Input type="number" min="1" step="0.01" value={dailyBudget} onChange={e => setDailyBudget(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Budget ($) *</label>
              <Input type="number" min="10" step="0.01" value={totalBudget} onChange={e => setTotalBudget(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Start Date *
              </label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> End Date
              </label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Campaign Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium">Campaign Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Campaign:</span><span>{campaignName}</span>
              <span className="text-muted-foreground">Format:</span><span>{selectedFormat?.name}</span>
              <span className="text-muted-foreground">Rate:</span><span>{selectedFormat?.price}</span>
              <span className="text-muted-foreground">Daily Budget:</span><span>${dailyBudget}</span>
              <span className="text-muted-foreground">Total Budget:</span><span className="font-semibold text-primary">${totalBudget}</span>
              <span className="text-muted-foreground">Categories:</span><span>{targetCategories.join(', ') || 'All'}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Payment Information
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Your campaign will be submitted for review. Once approved, you'll receive payment instructions via email.
              MiyTube accepts payments via credit card, PayPal, and bank transfer.
            </p>
            <div className="mt-3 p-3 bg-background rounded border">
              <div className="flex justify-between text-sm">
                <span>Campaign Total:</span>
                <span className="font-bold text-lg">${totalBudget}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">You will only be charged when your ads are shown to viewers.</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <DollarSign className="h-4 w-4 mr-2" />}
              {isSubmitting ? 'Submitting...' : 'Submit Campaign'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
