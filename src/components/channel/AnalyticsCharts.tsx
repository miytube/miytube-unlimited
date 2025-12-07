import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  shares?: number;
  created_at: string;
}

interface TrafficSources {
  organic: number;
  search: number;
  external: number;
  suggested: number;
}

interface AnalyticsChartsProps {
  content: ContentItem[];
  stats: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
  };
  trafficSources: TrafficSources;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ content, stats, trafficSources }) => {
  // Prepare data for views over time chart
  const viewsOverTimeData = useMemo(() => {
    const sortedContent = [...content].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    // Group by date and accumulate views
    const dateMap = new Map<string, number>();
    let cumulativeViews = 0;
    
    sortedContent.forEach(item => {
      const date = new Date(item.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      cumulativeViews += item.views;
      dateMap.set(date, cumulativeViews);
    });
    
    return Array.from(dateMap.entries()).map(([date, views]) => ({
      date,
      views,
    }));
  }, [content]);

  // Prepare data for engagement comparison bar chart
  const engagementData = useMemo(() => {
    return content
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(item => ({
        name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
        views: item.views,
        likes: item.likes,
      }));
  }, [content]);

  // Prepare data for engagement distribution pie chart
  const engagementDistribution = useMemo(() => {
    return [
      { name: 'Views', value: stats.totalViews, color: 'hsl(var(--primary))' },
      { name: 'Likes', value: stats.totalLikes, color: 'hsl(var(--chart-2))' },
      { name: 'Shares', value: stats.totalShares, color: 'hsl(var(--chart-3))' },
    ].filter(item => item.value > 0);
  }, [stats]);

  // Prepare data for traffic sources chart
  const trafficData = useMemo(() => {
    const total = trafficSources.organic + trafficSources.search + trafficSources.external + trafficSources.suggested;
    return [
      { name: 'Organic', value: trafficSources.organic, percentage: total > 0 ? (trafficSources.organic / total * 100).toFixed(1) : 0 },
      { name: 'Search', value: trafficSources.search, percentage: total > 0 ? (trafficSources.search / total * 100).toFixed(1) : 0 },
      { name: 'External', value: trafficSources.external, percentage: total > 0 ? (trafficSources.external / total * 100).toFixed(1) : 0 },
      { name: 'Suggested', value: trafficSources.suggested, percentage: total > 0 ? (trafficSources.suggested / total * 100).toFixed(1) : 0 },
    ].filter(item => item.value > 0);
  }, [trafficSources]);

  const totalTraffic = trafficSources.organic + trafficSources.search + trafficSources.external + trafficSources.suggested;

  // Custom tooltip style
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Views Over Time Line Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cumulative Views Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content Engagement Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Content Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="views" 
                    fill="hsl(var(--primary))" 
                    name="Views"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar 
                    dataKey="likes" 
                    fill="hsl(var(--chart-2))" 
                    name="Likes"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Distribution Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {engagementDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => value.toLocaleString()}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          {totalTraffic === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No traffic data available yet.</p>
              <p className="text-sm">Traffic sources will appear as your content gets discovered.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Pie Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`traffic-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => value.toLocaleString()}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Traffic Breakdown List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }} />
                    <div>
                      <p className="font-medium">Organic</p>
                      <p className="text-xs text-muted-foreground">Direct visits & browse</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{trafficSources.organic.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{totalTraffic > 0 ? ((trafficSources.organic / totalTraffic) * 100).toFixed(1) : 0}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
                    <div>
                      <p className="font-medium">Search</p>
                      <p className="text-xs text-muted-foreground">Platform search results</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{trafficSources.search.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{totalTraffic > 0 ? ((trafficSources.search / totalTraffic) * 100).toFixed(1) : 0}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[2] }} />
                    <div>
                      <p className="font-medium">External</p>
                      <p className="text-xs text-muted-foreground">Links from other sites</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{trafficSources.external.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{totalTraffic > 0 ? ((trafficSources.external / totalTraffic) * 100).toFixed(1) : 0}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[3] }} />
                    <div>
                      <p className="font-medium">Suggested</p>
                      <p className="text-xs text-muted-foreground">Recommendations & related</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{trafficSources.suggested.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{totalTraffic > 0 ? ((trafficSources.suggested / totalTraffic) * 100).toFixed(1) : 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};