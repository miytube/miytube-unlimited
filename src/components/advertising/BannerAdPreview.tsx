import React from 'react';

interface BannerAdPreviewProps {
  headline: string;
  description?: string;
  businessName: string;
  callToAction: string;
  mediaUrl?: string;
  destinationUrl?: string;
  className?: string;
}

// Auto-generated banner card. Renders a Meta/Facebook-style ad using only text
// input, with an optional user-uploaded image. Deterministic gradient based on
// business name so each advertiser gets a consistent look.
const GRADIENTS = [
  'from-indigo-600 via-purple-600 to-pink-600',
  'from-emerald-500 via-teal-600 to-cyan-600',
  'from-orange-500 via-red-500 to-pink-600',
  'from-blue-600 via-sky-500 to-cyan-400',
  'from-fuchsia-600 via-purple-600 to-indigo-700',
  'from-amber-500 via-orange-600 to-rose-600',
];

const pickGradient = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
};

export const BannerAdPreview: React.FC<BannerAdPreviewProps> = ({
  headline,
  description,
  businessName,
  callToAction,
  mediaUrl,
  className = '',
}) => {
  const gradient = pickGradient(businessName || headline || 'default');
  const initials = (businessName || 'AD')
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`w-full rounded-xl overflow-hidden border border-border shadow-sm bg-card ${className}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Visual side */}
        <div className={`relative sm:w-64 h-40 sm:h-auto shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          {mediaUrl ? (
            <img src={mediaUrl} alt={businessName} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="text-white text-center px-4">
              <div className="text-4xl font-black tracking-tight drop-shadow">{initials}</div>
              <div className="text-xs mt-2 uppercase tracking-widest opacity-90">Sponsored</div>
            </div>
          )}
        </div>
        {/* Content side */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Sponsored · {businessName || 'Your Business'}
            </div>
            <h3 className="text-lg font-semibold leading-tight line-clamp-2">
              {headline || 'Your headline here'}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{description}</p>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground truncate">{businessName}</span>
            <span className="inline-flex items-center rounded-md bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5">
              {callToAction || 'Learn More'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
