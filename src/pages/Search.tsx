import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useAISearch } from '@/hooks/useAISearch';
import { Search as SearchIcon, Upload, Filter, SortAsc, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { uploadedVideos } = useUploadedVideos();
  const { search, isSearching, results, error } = useAISearch();
  const [sortBy, setSortBy] = useState('relevance');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [hasSearchedAI, setHasSearchedAI] = useState(false);

  // Trigger AI search when query changes
  useEffect(() => {
    if (query.trim()) {
      setHasSearchedAI(true);
      search(query, {
        sortBy,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      });
    }
  }, [query, sortBy, categoryFilter]);

  // Also filter local uploaded videos as fallback
  const localFilteredVideos = query
    ? uploadedVideos.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.category?.toLowerCase().includes(query.toLowerCase()) ||
        video.subcategory?.toLowerCase().includes(query.toLowerCase()) ||
        video.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : uploadedVideos;

  // Merge AI results with local results
  const aiVideos = results?.videos || [];
  const aiMusicVideos = results?.musicVideos || [];
  const hasAIResults = aiVideos.length > 0 || aiMusicVideos.length > 0;

  // Get unique categories from results for filter
  const categories = new Set<string>();
  aiVideos.forEach(v => v.category && categories.add(v.category));
  localFilteredVideos.forEach(v => v.category && categories.add(v.category));

  return (
    <Layout>
      <div className="py-6 w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Search
        </p>

        {query && (
          <div className="mb-6">
            <h1 className="text-xl font-medium mb-2">
              Search results for <span className="text-primary">"{query}"</span>
            </h1>
            {results?.searchIntent && results.searchIntent !== query && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI understood: "{results.searchIntent}"
              </p>
            )}
            {results?.detectedCategory && (
              <Badge variant="secondary" className="mt-1">
                Category: {results.detectedCategory}
              </Badge>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(categories).sort().map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isSearching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              AI searching...
            </div>
          )}

          {results && (
            <span className="text-sm text-muted-foreground ml-auto">
              {results.totalResults} results found
            </span>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {/* AI Database Results */}
        {hasAIResults && (
          <div className="mb-8">
            {aiVideos.length > 0 && (
              <>
                <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Videos ({aiVideos.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in mb-6">
                  {aiVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      thumbnail={video.thumbnail_url || video.cloud_url || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80'}
                      channelName={video.category || 'MiyTube'}
                      views={`${video.views || 0} views`}
                      timestamp={new Date(video.created_at).toLocaleDateString()}
                      duration={video.duration || '0:00'}
                      description={video.description || ''}
                    />
                  ))}
                </div>
              </>
            )}

            {aiMusicVideos.length > 0 && (
              <>
                <h2 className="text-lg font-medium mb-3">Music Videos ({aiMusicVideos.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                  {aiMusicVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      thumbnail={video.thumbnail_url || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80'}
                      channelName="Music"
                      views={`${video.views || 0} views`}
                      timestamp={new Date(video.created_at).toLocaleDateString()}
                      duration={video.duration || '0:00'}
                      description={video.description || ''}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Local Results Fallback */}
        {!hasAIResults && localFilteredVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
            {localFilteredVideos.slice(0, 20).map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                channelName="Your Channel"
                views={video.views}
                timestamp={video.timestamp}
                duration={video.duration}
                description={video.description}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isSearching && !hasAIResults && localFilteredVideos.length === 0 && (
          <div className="text-center py-12 bg-card rounded-lg">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">
              {query ? 'No results found' : 'No videos uploaded yet'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {query ? 'Try different keywords or check your spelling' : 'Upload videos to search through them'}
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Content</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
