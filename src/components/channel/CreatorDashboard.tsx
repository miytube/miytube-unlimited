
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UploadCloud, TrendingUp, Users, Settings } from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Start uploading to get views</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Grow your audience</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Content Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Videos, audio, and more</p>
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
            <CardContent className="flex flex-col items-center justify-center py-10">
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track your channel performance</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-muted p-6 mb-4">
                <TrendingUp className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">No analytics available</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Upload content to start tracking views, engagement, and growth metrics.
              </p>
            </CardContent>
          </Card>
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
              <CardDescription>Customize your channel preferences</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Settings className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">Channel setup required</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Complete your channel profile to customize your branding and settings.
              </p>
              <Button variant="outline">Complete Setup</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
