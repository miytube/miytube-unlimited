import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, CheckCircle } from 'lucide-react';

const contentCategories = [
  'Music',
  'Gaming',
  'Entertainment',
  'Education',
  'Sports',
  'Comedy',
  'News & Politics',
  'Science & Technology',
  'Film & Animation',
  'How-To & Style',
  'Travel & Events',
  'Other'
];

const PartnerApplicationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [checkingApplication, setCheckingApplication] = useState(true);
  
  const [formData, setFormData] = useState({
    channelName: '',
    subscriberCount: '',
    watchHours: '',
    contentCategory: '',
    reason: ''
  });

  useEffect(() => {
    checkExistingApplication();
  }, [user]);

  const checkExistingApplication = async () => {
    if (!user) {
      setCheckingApplication(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('partner_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setExistingApplication(data);
    } catch (error) {
      console.error('Error checking application:', error);
    } finally {
      setCheckingApplication(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for the Partner Program.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!formData.channelName || !formData.contentCategory || !formData.reason) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('partner_applications')
        .insert({
          user_id: user.id,
          channel_name: formData.channelName.trim(),
          subscriber_count: parseInt(formData.subscriberCount) || 0,
          watch_hours: parseInt(formData.watchHours) || 0,
          content_category: formData.contentCategory,
          reason: formData.reason.trim()
        });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon."
      });

      checkExistingApplication();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingApplication) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            Please sign in to apply for the MiyTube Partner Program.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (existingApplication) {
    const statusColors = {
      pending: 'text-yellow-500',
      approved: 'text-green-500',
      denied: 'text-red-500'
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Application Submitted
          </CardTitle>
          <CardDescription>
            You have already submitted an application for the Partner Program.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Channel Name</p>
              <p className="font-medium">{existingApplication.channel_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className={`font-medium capitalize ${statusColors[existingApplication.status as keyof typeof statusColors]}`}>
                {existingApplication.status}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium">
                {new Date(existingApplication.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Content Category</p>
              <p className="font-medium">{existingApplication.content_category}</p>
            </div>
          </div>
          {existingApplication.admin_notes && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Admin Notes:</p>
              <p className="text-sm">{existingApplication.admin_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for Partner Program</CardTitle>
        <CardDescription>
          Fill out the form below to apply for the MiyTube Partner Program.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channelName">Channel Name *</Label>
            <Input
              id="channelName"
              value={formData.channelName}
              onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
              placeholder="Your channel name"
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subscriberCount">Subscriber Count</Label>
              <Input
                id="subscriberCount"
                type="number"
                value={formData.subscriberCount}
                onChange={(e) => setFormData({ ...formData, subscriberCount: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="watchHours">Watch Hours (Last 12 months)</Label>
              <Input
                id="watchHours"
                type="number"
                value={formData.watchHours}
                onChange={(e) => setFormData({ ...formData, watchHours: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentCategory">Content Category *</Label>
            <Select
              value={formData.contentCategory}
              onValueChange={(value) => setFormData({ ...formData, contentCategory: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your content category" />
              </SelectTrigger>
              <SelectContent>
                {contentCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Why do you want to join? *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Tell us about your channel and why you'd like to join the Partner Program..."
              rows={4}
              maxLength={1000}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PartnerApplicationForm;
