import React from 'react';
import { DollarSign, Users, TrendingUp, Star } from 'lucide-react';

const PRICING_TIERS = [
  {
    name: 'Starter',
    minBudget: '$10',
    features: ['Discovery Ads', 'Basic targeting', 'Performance reports', 'Up to 1,000 views/day'],
    recommended: false,
  },
  {
    name: 'Growth',
    minBudget: '$50',
    features: ['All ad formats', 'Advanced targeting', 'Real-time analytics', 'Up to 10,000 views/day', 'Priority placement'],
    recommended: true,
  },
  {
    name: 'Enterprise',
    minBudget: '$500',
    features: ['All ad formats', 'Premium placement', 'Dedicated account manager', 'Unlimited views', 'Custom reporting', 'A/B testing'],
    recommended: false,
  },
];

export const AdPricing: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Advertising Pricing</h2>
      <p className="text-muted-foreground mb-6">Choose a budget that works for your business. Only pay when viewers engage with your ads.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {PRICING_TIERS.map(tier => (
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
            <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
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
