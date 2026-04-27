import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Eye, Activity, TrendingUp, Globe, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ContentEngagementSection } from './ContentEngagementSection';

interface AnalyticsData {
  activeUsers: number;
  todayPageViews: number;
  totalPageViews: number;
  uniqueVisitors: number;
  topPages: { page_path: string; count: number }[];
  hourlyViews: { hour: string; views: number }[];
}

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    activeUsers: 0,
    todayPageViews: 0,
    totalPageViews: 0,
    uniqueVisitors: 0,
    topPages: [],
    hourlyViews: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Get active users count
      const { count: activeCount } = await supabase
        .from('active_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('last_active_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      // Get today's page views
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get total page views
      const { count: totalViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

      // Get unique visitors (by session_id) today
      const { data: uniqueData } = await supabase
        .from('page_views')
        .select('session_id')
        .gte('created_at', today.toISOString());
      
      const uniqueVisitors = new Set(uniqueData?.map(d => d.session_id)).size;

      // Get top pages
      const { data: pageViewsData } = await supabase
        .from('page_views')
        .select('page_path')
        .gte('created_at', today.toISOString());

      const pageCounts: Record<string, number> = {};
      pageViewsData?.forEach(pv => {
        pageCounts[pv.page_path] = (pageCounts[pv.page_path] || 0) + 1;
      });

      const topPages = Object.entries(pageCounts)
        .map(([page_path, count]) => ({ page_path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get hourly views for the last 24 hours
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const { data: hourlyData } = await supabase
        .from('page_views')
        .select('created_at')
        .gte('created_at', last24Hours.toISOString());

      const hourlyViewsMap: Record<string, number> = {};
      for (let i = 0; i < 24; i++) {
        const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
        const hourKey = hour.getHours().toString().padStart(2, '0') + ':00';
        hourlyViewsMap[hourKey] = 0;
      }

      hourlyData?.forEach(pv => {
        const hour = new Date(pv.created_at).getHours().toString().padStart(2, '0') + ':00';
        if (hourlyViewsMap.hasOwnProperty(hour)) {
          hourlyViewsMap[hour]++;
        }
      });

      const hourlyViews = Object.entries(hourlyViewsMap).map(([hour, views]) => ({
        hour,
        views,
      }));

      setAnalytics({
        activeUsers: activeCount || 0,
        todayPageViews: todayViews || 0,
        totalPageViews: totalViews || 0,
        uniqueVisitors,
        topPages,
        hourlyViews,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to real-time updates for active sessions
    const channel = supabase
      .channel('active-sessions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'active_sessions' },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Now
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{analytics.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Users in last 5 minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Page Views
            </CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.todayPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Views since midnight
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Visitors Today
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique sessions today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Page Views
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Page Views (Last 24 Hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.hourlyViews}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 12 }}
                    interval={3}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Pages Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {analytics.topPages.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topPages} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="page_path" 
                      tick={{ fontSize: 11 }}
                      width={120}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No page views recorded yet today
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content engagement: views, clicks, likes, shares */}
      <ContentEngagementSection />
    </div>
  );
};
