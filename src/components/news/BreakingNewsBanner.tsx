import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export const BreakingNewsBanner = () => {
  const [news, setNews] = useState<BreakingNews[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchBreakingNews();
  }, []);

  useEffect(() => {
    if (news.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [news.length]);

  const fetchBreakingNews = async () => {
    const { data, error } = await supabase
      .from('breaking_news')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      // Filter out expired news
      const activeNews = data.filter((item: any) => {
        if (!item.expires_at) return true;
        return new Date(item.expires_at) > new Date();
      });
      setNews(activeNews);
    }
  };

  if (dismissed || news.length === 0) return null;

  const currentNews = news[currentIndex];
  const isBreaking = currentNews?.is_breaking;

  return (
    <div className={`w-full py-2 px-4 ${isBreaking ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isBreaking && <AlertTriangle className="h-4 w-4 flex-shrink-0 animate-pulse" />}
          <span className="font-bold uppercase text-xs tracking-wider flex-shrink-0">
            {isBreaking ? 'Breaking' : 'News'}
          </span>
          <span className="text-sm truncate">{currentNews?.title}</span>
          {currentNews?.source && (
            <span className="text-xs opacity-75 flex-shrink-0">— {currentNews.source}</span>
          )}
          {currentNews?.source_url && (
            <a
              href={currentNews.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:opacity-75"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          {news.length > 1 && (
            <div className="flex gap-1">
              {news.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex ? 'bg-current' : 'bg-current/30'
                  }`}
                />
              ))}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-current/10"
            onClick={() => setDismissed(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
