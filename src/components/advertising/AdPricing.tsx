import React from 'react';
import { DollarSign, Users, TrendingUp, Star, Sparkles } from 'lucide-react';

// Discounts are disabled — packages always bill at their standard rate.
const LAUNCH_PROMO_END = new Date('2026-08-22T23:59:59Z');
const isPromoActive = () => false;

type PackageRow = {
  name: string;
  placement: 'Watch pages' | 'Homepage';
  duration: string;
  normalPrice: number;
  launchPrice: number;
  highlight?: string;
};

const PACKAGES: PackageRow[] = [
  { name: '7-Day Watch Banner',  placement: 'Watch pages', duration: '7 days',   normalPrice: 200,  launchPrice: 160 },
  { name: '14-Day Watch Banner', placement: 'Watch pages', duration: '14 days',  normalPrice: 350,  launchPrice: 280 },
  { name: '30-Day Watch Banner', placement: 'Watch pages', duration: '30 days',  normalPrice: 600,  launchPrice: 480, highlight: 'Best value' },
  { name: '24-Hour Homepage Takeover', placement: 'Homepage', duration: '24 hours', normalPrice: 2500, launchPrice: 1500 },
  { name: '7-Day Homepage Banner',     placement: 'Homepage', duration: '7 days',   normalPrice: 2000, launchPrice: 1600 },
  { name: '30-Day Homepage Banner',    placement: 'Homepage', duration: '30 days',  normalPrice: 6000, launchPrice: 4800 },
];

const TIERS = [
  { name: 'Starter',    minBudget: '$10',  features: ['Discovery Ads', 'Basic targeting', 'Performance reports', 'Up to 1,000 views/day'] },
  { name: 'Growth',     minBudget: '$50',  features: ['All ad formats', 'Advanced targeting', 'Real-time analytics', 'Up to 10,000 views/day', 'Priority placement'], recommended: true },
  { name: 'Enterprise', minBudget: '$500', features: ['All ad formats', 'Premium placement', 'Dedicated account manager', 'Unlimited views', 'Custom reporting', 'A/B testing'] },
];

export const AdPricing: React.FC = () => {
  const promo = isPromoActive();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Advertising Pricing</h2>
      <p className="text-muted-foreground mb-6">
        Fixed-duration packages, flexible tiers, or a fully custom budget. Every price is set at least
        20% below comparable Meta, LinkedIn and YouTube slots.
      </p>

      {promo && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 p-4">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold text-primary">Launch offer — up to 40% off</div>
            <div className="text-muted-foreground">
              Promo pricing runs through{' '}
              <strong>{LAUNCH_PROMO_END.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
              After that, packages return to their normal rate automatically.
            </div>
          </div>
        </div>
      )}

      {/* Fixed-duration packages */}
      <h3 className="text-xl font-semibold mb-3">Fixed-Duration Packages</h3>
      <div className="overflow-x-auto rounded-lg border border-border mb-10">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium">Package</th>
              <th className="p-3 font-medium">Placement</th>
              <th className="p-3 font-medium">Duration</th>
              <th className="p-3 font-medium text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {PACKAGES.map(p => (
              <tr key={p.name} className="border-t border-border">
                <td className="p-3">
                  <div className="font-medium flex items-center gap-2">
                    {p.name}
                    {p.highlight && (
                      <span className="text-[10px] uppercase tracking-wide bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {p.highlight}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{p.placement}</td>
                <td className="p-3 text-muted-foreground">{p.duration}</td>
                <td className="p-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-primary">${(promo ? p.launchPrice : p.normalPrice).toLocaleString()}</span>
                    {promo && p.launchPrice < p.normalPrice && (
                      <span className="text-xs text-muted-foreground line-through">${p.normalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tier plans */}
      <h3 className="text-xl font-semibold mb-3">Flexible Tiers</h3>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {TIERS.map(tier => (
          <div
            key={tier.name}
            className={`relative bg-card rounded-lg border p-6 ${
              tier.recommended ? 'border-primary ring-2 ring-primary/20' : 'border-border'
            }`}
          >
            {tier.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" /> Recommended
                </span>
              </div>
            )}
            <h4 className="text-xl font-bold mb-1">{tier.name}</h4>
            <p className="text-2xl font-bold text-primary mb-4">
              {tier.minBudget}<span className="text-sm font-normal text-muted-foreground">/min budget</span>
            </p>
            <ul className="space-y-2">
              {tier.features.map(f => (
                <li key={f} className="text-sm flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Cost per engagement */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Cost Per Engagement</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">Discovery Ads</div>
              <div className="text-muted-foreground">$0.01 per view</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">In-stream Ads</div>
              <div className="text-muted-foreground">$0.02-$0.03 per view</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">Banner/Overlay</div>
              <div className="text-muted-foreground">$0.005-$0.008 per impression</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
