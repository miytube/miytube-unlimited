import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { subDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UploadCloud, TrendingUp, Users, Eye, ThumbsUp, Share2, Clock, Loader2 } from 'lucide-react';
import { ChannelSettingsForm } from './ChannelSettingsForm';
import { AnalyticsCharts } from './AnalyticsCharts';
import { DateRangeFilter } from './DateRangeFilter';
import { supabase } from '@/integrations/supabase/client';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface CreatorStats {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  contentCount: number;
  totalWatchTime: number;
  avgClickThroughRate: number;
  trafficOrganic: number;
  trafficSearch: number;
  trafficExternal: number;
  trafficSuggested: number;
}

interface ContentItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  created_at: string;
  thumbnail_url: string | null;
}

export const CreatorDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CreatorStats>({
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    contentCount: 0,
    totalWatchTime: 0,
    avgClickThroughRate: 0,
    trafficOrganic: 0,
    trafficSearch: 0,
    trafficExternal: 0,
    trafficSuggested: 0,
  });
  const [content, setContent] = useState<ContentItem[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const fetchCreatorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all music videos for the logged-in user
      const { data: videos, error } = await supabase
        .from('music_videos')
        .select('id, title, views, likes, shares, watch_time_seconds, click_through_rate, created_at, thumbnail_url, traffic_organic, traffic_search, traffic_external, traffic_suggested')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (videos && videos.length > 0) {
        // Calculate aggregate stats
        const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
        const totalLikes = videos.reduce((sum, v) => sum + (v.likes || 0), 0);
        const totalShares = videos.reduce((sum, v) => sum + (v.shares || 0), 0);
        const totalWatchTime = videos.reduce((sum, v) => sum + (v.watch_time_seconds || 0), 0);
        const avgCTR = videos.reduce((sum, v) => sum + (Number(v.click_through_rate) || 0), 0) / videos.length;
        const trafficOrganic = videos.reduce((sum, v) => sum + (v.traffic_organic || 0), 0);
        const trafficSearch = videos.reduce((sum, v) => sum + (v.traffic_search || 0), 0);
        const trafficExternal = videos.reduce((sum, v) => sum + (v.traffic_external || 0), 0);
        const trafficSuggested = videos.reduce((sum, v) => sum + (v.traffic_suggested || 0), 0);

        setStats({
          totalViews,
          totalLikes,
          totalShares,
          contentCount: videos.length,
          totalWatchTime,
          avgClickThroughRate: avgCTR,
          trafficOrganic,
          trafficSearch,
          trafficExternal,
          trafficSuggested,
        });

        setContent(videos.map(v => ({
          id: v.id,
          title: v.title,
          views: v.views || 0,
          likes: v.likes || 0,
          created_at: v.created_at,
          thumbnail_url: v.thumbnail_url,
        })));
      }
    } catch (error) {
      console.error('Error fetching creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter content based on date range for analytics
  const filteredContent = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return content;
    
    return content.filter(item => {
      const itemDate = new Date(item.created_at);
      if (dateRange.from && itemDate < dateRange.from) return false;
      if (dateRange.to && itemDate > dateRange.to) return false;
      return true;
    });
  }, [content, dateRange]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    if (filteredContent.length === 0) {
      return {
        totalViews: 0,
        totalLikes: 0,
        totalShares: 0,
        contentCount: 0,
        totalWatchTime: 0,
        avgClickThroughRate: 0,
        trafficOrganic: 0,
        trafficSearch: 0,
        trafficExternal: 0,
        trafficSuggested: 0,
      };
    }

    const totalViews = filteredContent.reduce((sum, v) => sum + v.views, 0);
    const totalLikes = filteredContent.reduce((sum, v) => sum + v.likes, 0);

    return {
      totalViews,
      totalLikes,
      totalShares: Math.round(totalViews * 0.05), // Estimate from filtered
      contentCount: filteredContent.length,
      totalWatchTime: Math.round(totalViews * 30), // Estimate avg 30s per view
      avgClickThroughRate: stats.avgClickThroughRate,
      trafficOrganic: Math.round(stats.trafficOrganic * (filteredContent.length / (content.length || 1))),
      trafficSearch: Math.round(stats.trafficSearch * (filteredContent.length / (content.length || 1))),
      trafficExternal: Math.round(stats.trafficExternal * (filteredContent.length / (content.length || 1))),
      trafficSuggested: Math.round(stats.trafficSuggested * (filteredContent.length / (content.length || 1))),
    };
  }, [filteredContent, content.length, stats]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatWatchTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Creator Dashboard</h2>
          <p className="text-muted-foreground">Manage your content and channel</p>
        </div>
        
        <Button className="gap-2" asChild>
          <Link to="/upload">
            <UploadCloud size={16} />
            Upload New Content
          </Link>
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalViews)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              Total Likes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalLikes)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Total Shares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalShares)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Watch Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatWatchTime(stats.totalWatchTime)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg CTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgClickThroughRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Content</CardTitle>
              <CardDescription>Manage all your uploaded content</CardDescription>
            </CardHeader>
            <CardContent>
              {content.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <UploadCloud className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">No content yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Start uploading videos, music, podcasts, or other content to grow your channel.
                  </p>
                  <Button className="gap-2" asChild>
                    <Link to="/upload">
                      <UploadCloud size={16} />
                      Upload Your First Content
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {content.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="w-24 h-14 bg-muted rounded overflow-hidden flex-shrink-0">
                        {item.thumbnail_url ? (
                          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UploadCloud className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {formatNumber(item.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {formatNumber(item.likes)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          {stats.contentCount === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Track your channel performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <TrendingUp className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">No analytics available</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Upload content to start tracking views, engagement, and growth metrics.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Date Range Filter */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">Analytics Overview</CardTitle>
                      <CardDescription>Filter by date range to analyze specific periods</CardDescription>
                    </div>
                    <DateRangeFilter 
                      dateRange={dateRange} 
                      onDateRangeChange={setDateRange} 
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredContent.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No content found in the selected date range.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Showing analytics for {filteredContent.length} item{filteredContent.length !== 1 ? 's' : ''} in selected period
                    </p>
                  )}
                </CardContent>
              </Card>

              {filteredContent.length > 0 && (
                <>
                  {/* Charts Section */}
                  <AnalyticsCharts 
                    content={filteredContent} 
                    stats={{
                      totalViews: filteredStats.totalViews,
                      totalLikes: filteredStats.totalLikes,
                      totalShares: filteredStats.totalShares,
                    }}
                    trafficSources={{
                      organic: filteredStats.trafficOrganic,
                      search: filteredStats.trafficSearch,
                      external: filteredStats.trafficExternal,
                      suggested: filteredStats.trafficSuggested,
                    }}
                  />

                  {/* Summary Stats */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">Avg Views</p>
                          <p className="text-xl font-bold">
                            {formatNumber(Math.round(filteredStats.totalViews / filteredStats.contentCount))}
                          </p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">Avg Likes</p>
                          <p className="text-xl font-bold">
                            {formatNumber(Math.round(filteredStats.totalLikes / filteredStats.contentCount))}
                          </p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">Like-to-View</p>
                          <p className="text-xl font-bold">
                            {filteredStats.totalViews > 0 
                              ? ((filteredStats.totalLikes / filteredStats.totalViews) * 100).toFixed(1) 
                              : 0}%
                          </p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">Avg Watch Time</p>
                          <p className="text-xl font-bold">
                            {formatWatchTime(Math.round(filteredStats.totalWatchTime / filteredStats.contentCount))}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comments" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Manage audience interactions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">No comments yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Upload content to start engaging with your audience through comments.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Channel Settings</CardTitle>
              <CardDescription>Customize your channel profile and preferences</CardDescription>
            </CardHeader>
            <CardContent className="max-w-md mx-auto">
              <ChannelSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};