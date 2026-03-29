import { useState, useEffect, useCallback } from 'react';
import { Zap, Trophy, Cpu, FlaskConical, Globe, TrendingUp, Clapperboard, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewsFlash {
  category: string;
  icon: React.ElementType;
  headline: string;
  color: string;
}

const NEWS_FLASHES: NewsFlash[] = [
  { category: 'Breaking', icon: Zap, headline: 'Major earthquake strikes Pacific coast — emergency services deployed across the region', color: 'bg-destructive text-destructive-foreground' },
  { category: 'Sports', icon: Trophy, headline: 'World Cup qualifier — host nation clinches dramatic last-minute victory to advance', color: 'bg-orange-600 text-white' },
  { category: 'AI & Tech', icon: Cpu, headline: 'OpenAI unveils next-generation reasoning model capable of real-time video understanding', color: 'bg-blue-600 text-white' },
  { category: 'Innovation', icon: FlaskConical, headline: 'Scientists achieve breakthrough in solid-state battery technology — 10x faster charging', color: 'bg-emerald-600 text-white' },
  { category: 'World', icon: Globe, headline: 'Historic peace agreement signed between three nations after decade-long negotiations', color: 'bg-purple-600 text-white' },
  { category: 'Business', icon: TrendingUp, headline: 'Global markets rally as central banks signal coordinated economic stimulus package', color: 'bg-amber-600 text-white' },
  { category: 'Entertainment', icon: Clapperboard, headline: 'Record-breaking film surpasses $2 billion worldwide — becomes highest-grossing of the year', color: 'bg-pink-600 text-white' },
  { category: 'Health', icon: Heart, headline: 'WHO approves revolutionary vaccine targeting multiple respiratory viruses simultaneously', color: 'bg-teal-600 text-white' },
  { category: 'AI & Tech', icon: Cpu, headline: 'Autonomous robotics startup demonstrates fully self-operating warehouse logistics system', color: 'bg-blue-600 text-white' },
  { category: 'Sports', icon: Trophy, headline: 'Olympic committee announces three new sports to be included in 2028 Summer Games', color: 'bg-orange-600 text-white' },
  { category: 'Innovation', icon: FlaskConical, headline: 'NASA confirms successful test of ion-drive propulsion system for deep space missions', color: 'bg-emerald-600 text-white' },
  { category: 'Breaking', icon: Zap, headline: 'Massive cyberattack disrupts banking systems across Europe — investigations underway', color: 'bg-destructive text-destructive-foreground' },
];

const DISPLAY_DURATION = 15000; // 15 seconds per headline
const TRANSITION_DURATION = 600; // ms

const BreakingNewsRotator = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'visible' | 'exiting' | 'entering'>('visible');
  const [progress, setProgress] = useState(0);

  const advance = useCallback(() => {
    setPhase('exiting');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % NEWS_FLASHES.length);
      setPhase('entering');
      setProgress(0);
      setTimeout(() => setPhase('visible'), 50);
    }, TRANSITION_DURATION);
  }, []);

  // Progress bar timer
  useEffect(() => {
    if (phase !== 'visible') return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (DISPLAY_DURATION / 50));
        if (next >= 100) {
          advance();
          return 100;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [phase, advance]);

  const current = NEWS_FLASHES[currentIndex];
  const nextIndex = (currentIndex + 1) % NEWS_FLASHES.length;
  const next = NEWS_FLASHES[nextIndex];
  const Icon = current.icon;

  return (
    <div className="relative w-full rounded-xl overflow-hidden border bg-card mb-6">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-destructive">Live News Feed</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {currentIndex + 1} / {NEWS_FLASHES.length}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Next: <span className="font-medium text-foreground">{next.category}</span>
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="relative h-24 sm:h-20 overflow-hidden">
        <div
          className={`absolute inset-0 flex items-center gap-4 px-5 transition-all ${
            phase === 'exiting'
              ? 'opacity-0 -translate-y-6'
              : phase === 'entering'
              ? 'opacity-0 translate-y-6'
              : 'opacity-100 translate-y-0'
          }`}
          style={{ transitionDuration: `${TRANSITION_DURATION}ms`, transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <Badge className={`${current.color} shrink-0 gap-1.5 text-xs px-2.5 py-1 font-bold uppercase tracking-wider`}>
            <Icon className="h-3.5 w-3.5" />
            {current.category}
          </Badge>
          <p className="text-sm sm:text-base font-semibold leading-snug line-clamp-2">
            {current.headline}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-destructive transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Category pills ticker */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-t overflow-x-auto scrollbar-none">
        {NEWS_FLASHES.map((item, idx) => {
          const ItemIcon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setPhase('entering');
                setProgress(0);
                setTimeout(() => setPhase('visible'), 50);
              }}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                idx === currentIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <ItemIcon className="h-3 w-3" />
              {item.category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BreakingNewsRotator;
