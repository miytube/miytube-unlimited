import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Camera, Loader2, User } from 'lucide-react';

interface ProfileData {
  display_name: string | null;
  channel_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export const ChannelSettingsForm: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    display_name: '',
    channel_name: '',
    bio: '',
    avatar_url: null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, channel_name, bio, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          display_name: data.display_name || '',
          channel_name: data.channel_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Avatar must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));

      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate inputs
      if (profile.channel_name && profile.channel_name.length > 50) {
        toast({
          title: 'Invalid input',
          description: 'Channel name must be less than 50 characters',
          variant: 'destructive',
        });
        return;
      }

      if (profile.bio && profile.bio.length > 500) {
        toast({
          title: 'Invalid input',
          description: 'Bio must be less than 500 characters',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name?.trim() || null,
          channel_name: profile.channel_name?.trim() || null,
          bio: profile.bio?.trim() || null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your channel settings have been saved',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save profile changes',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || undefined} alt="Profile avatar" />
            <AvatarFallback>
              <User className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={uploading}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Click the camera icon to upload a profile picture
        </p>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name</Label>
        <Input
          id="display_name"
          placeholder="Your display name"
          value={profile.display_name || ''}
          onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground">
          This is how your name appears across the platform
        </p>
      </div>

      {/* Channel Name */}
      <div className="space-y-2">
        <Label htmlFor="channel_name">Channel Name</Label>
        <Input
          id="channel_name"
          placeholder="Your unique channel name"
          value={profile.channel_name || ''}
          onChange={(e) => setProfile(prev => ({ ...prev, channel_name: e.target.value }))}
          maxLength={50}
        />
        <p className="text-xs text-muted-foreground">
          Your unique channel identifier (max 50 characters)
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell viewers about yourself and your content..."
          value={profile.bio || ''}
          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          maxLength={500}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          {profile.bio?.length || 0}/500 characters
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
};