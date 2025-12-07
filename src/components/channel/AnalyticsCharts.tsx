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

interface AnalyticsChartsProps {
  content: ContentItem[];
  stats: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
  };
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ content, stats }) => {
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
    </div>
  );
};