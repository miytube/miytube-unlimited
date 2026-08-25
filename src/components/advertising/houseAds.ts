// MiyTube "house ads" — internal promos for our own advertising program.
// These rotate into the banner slot every HOUSE_AD_INTERVAL_HOURS hours,
// independently of paid campaigns. Edit copy or interval here.

export const HOUSE_AD_INTERVAL_HOURS = 2; // show a house ad once every N hours
export const HOUSE_AD_ENABLED = true;

export type HouseAd = {
  id: string;
  headline: string;
  description: string;
  businessName: string;
  callToAction: string;
  destinationUrl: string; // internal route or full URL
  mediaUrl?: string;
  placements: Array<'homepage' | 'watch'>;
  theme?: 'red' | 'blue' | 'yellow';
};

export const HOUSE_ADS: HouseAd[] = [
  {
    id: 'house-advertise-launch',
    headline: 'We have your Snapshot — advertise here at MiyTube',
    description:
      'Get your business in front of MiyTube viewers. Fixed-duration watch, homepage and pre-roll packages.',
    businessName: 'MiyTube Ads',
    callToAction: 'Start a Campaign',
    destinationUrl: '/advertising',
    placements: ['homepage', 'watch'],
    theme: 'yellow',
  },
  {
    id: 'house-discount-product-ad',
    headline: 'We have your Snapshot — advertise here at MiyTube',
    description:
      'Put your product in front of customers. Discovery ads from $0.01/view and banners from $0.005/impression.',
    businessName: 'MiyTube Ads',
    callToAction: 'Advertise Now',
    destinationUrl: '/advertising',
    placements: ['homepage', 'watch'],
    theme: 'yellow',
  },
  {
    id: 'house-homepage-takeover',
    headline: '24-Hour Homepage Takeover — $2,500',
    description:
      'Own the top of MiyTube for a full day. Exclusive placement, thousands of impressions, one flat price.',
    businessName: 'MiyTube Ads',
    callToAction: 'Reserve Now',
    destinationUrl: '/advertising',
    placements: ['homepage'],
    theme: 'yellow',
  },
  {
    id: 'house-creator-earnings',
    headline: 'Upload. Get tipped. Get paid.',
    description:
      'MiyTube creators keep 100% of viewer tips, turn any video into an SEO article with AI, and can apply for the Partner Program. Free to start.',
    businessName: 'MiyTube Creators',
    callToAction: 'See How It Works',
    destinationUrl: '/monetization',
    placements: ['homepage', 'watch'],
    theme: 'blue',
  },
  {
    id: 'house-video-to-article',
    headline: 'New: turn your video into an article with AI',
    description:
      'One click on your own video creates a search-friendly blog post — more traffic, no extra writing. Only on MiyTube.',
    businessName: 'MiyTube Creators',
    callToAction: 'Start Uploading',
    destinationUrl: '/monetization',
    placements: ['homepage', 'watch'],
    theme: 'blue',
  },
];


/**
 * Returns a house ad if the current time-bucket is a "house window",
 * otherwise null. Buckets flip every HOUSE_AD_INTERVAL_HOURS hours.
 * Within a house window we deterministically pick one of the ads eligible
 * for the given placement so it stays stable for that window.
 */
export function pickHouseAdForNow(placement: 'homepage' | 'watch'): HouseAd | null {
  if (!HOUSE_AD_ENABLED) return null;
  const eligible = HOUSE_ADS.filter(a => a.placements.includes(placement));
  if (eligible.length === 0) return null;

  const intervalMs = HOUSE_AD_INTERVAL_HOURS * 60 * 60 * 1000;
  const bucket = Math.floor(Date.now() / intervalMs);
  // Every other bucket is a "house window" — so a house ad shows every N hours.
  const isHouseWindow = bucket % 2 === 0;
  if (!isHouseWindow) return null;

  // Rotate by the house-window index (not the raw bucket), otherwise an even-only
  // bucket number always lands on the same ad when there are 2 eligible ads.
  const houseWindowIndex = Math.floor(bucket / 2);
  return eligible[houseWindowIndex % eligible.length];
}
