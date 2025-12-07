import { format } from 'date-fns';

interface ContentItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  created_at: string;
}

interface ExportStats {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  contentCount: number;
  trafficOrganic: number;
  trafficSearch: number;
  trafficExternal: number;
  trafficSuggested: number;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export const exportAnalyticsToCSV = (
  content: ContentItem[],
  stats: ExportStats,
  dateRange: DateRange
): void => {
  const rows: string[][] = [];
  
  // Header section
  rows.push(['MiyTube Analytics Export']);
  rows.push([`Generated: ${format(new Date(), 'PPpp')}`]);
  
  if (dateRange.from || dateRange.to) {
    const fromStr = dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'Beginning';
    const toStr = dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'Present';
    rows.push([`Date Range: ${fromStr} - ${toStr}`]);
  } else {
    rows.push(['Date Range: All Time']);
  }
  
  rows.push(['']);
  
  // Summary Statistics
  rows.push(['=== SUMMARY STATISTICS ===']);
  rows.push(['Metric', 'Value']);
  rows.push(['Total Content', stats.contentCount.toString()]);
  rows.push(['Total Views', stats.totalViews.toString()]);
  rows.push(['Total Likes', stats.totalLikes.toString()]);
  rows.push(['Total Shares', stats.totalShares.toString()]);
  rows.push(['Avg Views per Content', stats.contentCount > 0 ? Math.round(stats.totalViews / stats.contentCount).toString() : '0']);
  rows.push(['Avg Likes per Content', stats.contentCount > 0 ? Math.round(stats.totalLikes / stats.contentCount).toString() : '0']);
  rows.push(['Like-to-View Ratio', stats.totalViews > 0 ? `${((stats.totalLikes / stats.totalViews) * 100).toFixed(2)}%` : '0%']);
  
  rows.push(['']);
  
  // Traffic Sources
  rows.push(['=== TRAFFIC SOURCES ===']);
  rows.push(['Source', 'Views', 'Percentage']);
  const totalTraffic = stats.trafficOrganic + stats.trafficSearch + stats.trafficExternal + stats.trafficSuggested;
  
  if (totalTraffic > 0) {
    rows.push(['Organic', stats.trafficOrganic.toString(), `${((stats.trafficOrganic / totalTraffic) * 100).toFixed(1)}%`]);
    rows.push(['Search', stats.trafficSearch.toString(), `${((stats.trafficSearch / totalTraffic) * 100).toFixed(1)}%`]);
    rows.push(['External', stats.trafficExternal.toString(), `${((stats.trafficExternal / totalTraffic) * 100).toFixed(1)}%`]);
    rows.push(['Suggested', stats.trafficSuggested.toString(), `${((stats.trafficSuggested / totalTraffic) * 100).toFixed(1)}%`]);
  } else {
    rows.push(['No traffic data available', '', '']);
  }
  
  rows.push(['']);
  
  // Content Details
  rows.push(['=== CONTENT DETAILS ===']);
  rows.push(['Title', 'Views', 'Likes', 'Like Rate', 'Created Date']);
  
  content
    .sort((a, b) => b.views - a.views)
    .forEach(item => {
      const likeRate = item.views > 0 ? ((item.likes / item.views) * 100).toFixed(2) : '0';
      rows.push([
        `"${item.title.replace(/"/g, '""')}"`, // Escape quotes in title
        item.views.toString(),
        item.likes.toString(),
        `${likeRate}%`,
        format(new Date(item.created_at), 'yyyy-MM-dd'),
      ]);
    });
  
  // Convert to CSV string
  const csvContent = rows.map(row => row.join(',')).join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const fileName = `miytube-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};