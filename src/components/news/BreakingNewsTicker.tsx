import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [news, setNews] = useState<BreakingNews[]>([]);
  const [dismissed, setDismissed] = useState(false);

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

  const handleClick = (id: string) => {
    navigate(`/breaking-news?id=${id}`);
  };

  return (
    <div className="relative w-full bg-destructive text-destructive-foreground overflow-hidden">
      <div className="flex items-center h-9">
        {/* Label */}
        <button
          onClick={() => navigate('/breaking-news')}
          className="flex-shrink-0 z-10 flex items-center gap-1.5 bg-destructive px-3 h-full border-r border-destructive-foreground/20 hover:bg-destructive-foreground/10 transition-colors"
        >
          <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
          <span className="font-black uppercase text-[11px] tracking-[0.15em]">Breaking</span>
        </button>

        {/* Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-ticker whitespace-nowrap flex items-center h-9">
            {news.map((item) => (
              <button
                key={`a-${item.id}`}
                onClick={() => handleClick(item.id)}
                className="inline-flex items-center gap-1 px-3 text-sm font-medium hover:underline cursor-pointer transition-opacity hover:opacity-80"
              >
                {item.title}
                {item.source && (
                  <span className="text-[11px] opacity-60 font-normal">— {item.source}</span>
                )}
              </button>
            ))}
            <span className="inline-block px-3 text-destructive-foreground/40">•</span>
            {news.map((item) => (
              <button
                key={`b-${item.id}`}
                onClick={() => handleClick(item.id)}
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
  );
};
