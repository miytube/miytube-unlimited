import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, X } from 'lucide-react';

interface BreakingNews {
  id: string;
  title: string;
  content: string | null;
  source: string | null;
  source_url: string | null;
  category: string | null;
  is_breaking: boolean;
  created_at: string;
}

export const BreakingNewsTicker = () => {
  const [news, setNews] = useState<BreakingNews[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBreakingNews();

    const channel = supabase
      .channel('breaking-news-ticker')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'breaking_news' },
        () => fetchBreakingNews()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchBreakingNews = async () => {
    const { data, error } = await supabase
      .from('breaking_news')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      const activeNews = data.filter((item: any) => {
        if (!item.expires_at) return true;
        return new Date(item.expires_at) > new Date();
      });
      setNews(activeNews);
    }
  };

  if (dismissed || news.length === 0) return null;

  const tickerText = news.map(n => n.title).join('  •  ');
  // Duplicate for seamless loop
  const fullTicker = `${tickerText}  •  ${tickerText}`;

  return (
    <>
      <div className="relative w-full bg-destructive text-destructive-foreground overflow-hidden">
        <div className="flex items-center h-9">
          {/* Label */}
          <div className="flex-shrink-0 z-10 flex items-center gap-1.5 bg-destructive px-3 h-full border-r border-destructive-foreground/20">
            <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
            <span className="font-black uppercase text-[11px] tracking-[0.15em]">Breaking</span>
          </div>

          {/* Ticker */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-ticker whitespace-nowrap flex items-center h-9">
              {news.map((item, idx) => (
                <button
                  key={`a-${item.id}`}
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="inline-flex items-center gap-1 px-3 text-sm font-medium hover:underline cursor-pointer transition-opacity hover:opacity-80"
                >
                  {item.title}
                  {item.source && (
                    <span className="text-[11px] opacity-60 font-normal">— {item.source}</span>
                  )}
                </button>
              ))}
              <span className="inline-block px-3 text-destructive-foreground/40">•</span>
              {news.map((item, idx) => (
                <button
                  key={`b-${item.id}`}
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="inline-flex items-center gap-1 px-3 text-sm font-medium hover:underline cursor-pointer transition-opacity hover:opacity-80"
                >
                  {item.title}
                  {item.source && (
                    <span className="text-[11px] opacity-60 font-normal">— {item.source}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 z-10 px-2 h-full flex items-center hover:bg-destructive-foreground/10 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded detail panel */}
      {expandedId && (() => {
        const item = news.find(n => n.id === expandedId);
        if (!item) return null;
        return (
          <div className="w-full bg-card border-b animate-fade-in">
            <div className="max-w-5xl mx-auto px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.is_breaking && (
                      <span className="bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Breaking
                      </span>
                    )}
                    {item.category && (
                      <span className="bg-muted text-muted-foreground text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  {item.content && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {item.source && (
                      <span className="text-xs text-muted-foreground">Source: {item.source}</span>
                    )}
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Read full story →
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setExpandedId(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
};
