import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Video, BarChart3, Settings, Trash2, Newspaper, UserPlus, Wrench, Activity, Cloud } from 'lucide-react';
import { BreakingNewsManager } from '@/components/admin/BreakingNewsManager';
import PartnerApplicationsManager from '@/components/admin/PartnerApplicationsManager';
import { RepairMissingFilesManager } from '@/components/admin/RepairMissingFilesManager';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { S3ImportManager } from '@/components/admin/S3ImportManager';

type AppRole = 'admin' | 'moderator' | 'user';

interface UserWithRole {
  id: string;
  email: string;
  channel_name: string | null;
  role: AppRole;
  created_at: string;
}

interface VideoStats {
  total_videos: number;
  total_views: number;
  total_likes: number;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [videoStats, setVideoStats] = useState<VideoStats>({ total_videos: 0, total_views: 0, total_likes: 0 });
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchVideoStats();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        user_id,
        channel_name,
        created_at
      `);

    if (error) {
      console.error('Error fetching users:', error);
      setLoadingUsers(false);
      return;
    }

    // Fetch roles for each user
    const usersWithRoles: UserWithRole[] = [];
    for (const profile of data || []) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profile.user_id)
        .single();

      usersWithRoles.push({
        id: profile.user_id,
        email: '', // We don't have direct access to auth.users
        channel_name: profile.channel_name,
        role: roleData?.role || 'user',
        created_at: profile.created_at
      });
    }

    setUsers(usersWithRoles);
    setLoadingUsers(false);
  };

  const fetchVideoStats = async () => {
    const { data, error } = await supabase
      .from('music_videos')
      .select('views, likes');

    if (error) {
      console.error('Error fetching video stats:', error);
      return;
    }

    const stats = (data || []).reduce((acc, video) => ({
      total_videos: acc.total_videos + 1,
      total_views: acc.total_views + (video.views || 0),
      total_likes: acc.total_likes + (video.likes || 0)
    }), { total_videos: 0, total_views: 0, total_likes: 0 });

    setVideoStats(stats);
  };

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "User role updated successfully."
      });
      fetchUsers();
    }
  };

  const deleteVideo = async (videoId: string) => {
    const { error } = await supabase
      .from('music_videos')
      .delete()
      .eq('id', videoId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete video.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Video deleted successfully."
      });
      fetchVideoStats();
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">MiyTube Administration Center</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videoStats.total_videos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videoStats.total_views.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videoStats.total_likes.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <div className="w-full overflow-x-auto pb-2">
          <TabsList className="inline-flex w-max">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Content Moderation
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              Breaking News
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Partner Applications
            </TabsTrigger>
            <TabsTrigger value="repair" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Repair Files
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="s3" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              S3 Import
            </TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and roles</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Channel Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.channel_name || 'No channel'}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === 'admin' ? 'default' : u.role === 'moderator' ? 'secondary' : 'outline'}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onValueChange={(value) => updateUserRole(u.id, value as AppRole)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Review and moderate uploaded content</CardDescription>
              </CardHeader>
              <CardContent>
                <ContentModerationTable onDelete={deleteVideo} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Platform settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <BreakingNewsManager />
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            <PartnerApplicationsManager />
          </TabsContent>

          <TabsContent value="repair" className="mt-6">
            <RepairMissingFilesManager />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Analytics</CardTitle>
                <CardDescription>Real-time visitor tracking and page view statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="s3" className="mt-6">
            <S3ImportManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

const ContentModerationTable = ({ onDelete }: { onDelete: (id: string) => void }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('music_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error) {
        setVideos(data || []);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No videos to moderate.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {videos.map((video) => (
          <TableRow key={video.id}>
            <TableCell className="max-w-xs truncate">{video.title}</TableCell>
            <TableCell>{video.category || 'Uncategorized'}</TableCell>
            <TableCell>{video.views}</TableCell>
            <TableCell>{new Date(video.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(video.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Admin;
