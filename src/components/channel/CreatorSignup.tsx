import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { Video, BarChart, DollarSign } from 'lucide-react';

export const CreatorSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [channelName, setChannelName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Please agree to the terms",
        description: "You must agree to the terms and conditions to create a channel.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to create an account
    toast({
      title: "Account created!",
      description: `Welcome to MiyTube, ${channelName}! Your creator journey begins now.`,
    });
    
    // Reset the form
    setEmail('');
    setPassword('');
    setChannelName('');
    setAgreeTerms(false);
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would authenticate the user
    toast({
      title: "Welcome back!",
      description: "You've successfully logged in to your creator account.",
    });
    
    setIsLoginOpen(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Join Our Creator Community</h2>
        <p className="text-muted-foreground mb-6">
          Create a channel to share your content with millions of viewers around the world and start earning from your passion.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Share Your Content</h3>
              <p className="text-sm text-muted-foreground">Upload videos, music, podcasts, and more to share with a global audience.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Track Performance</h3>
              <p className="text-sm text-muted-foreground">Get detailed analytics on your content performance and audience engagement.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Monetize Your Channel</h3>
              <p className="text-sm text-muted-foreground">Earn money from your content through ads, sponsorships, and member subscriptions.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Create Your Channel</h2>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">Channel Name</Label>
            <Input 
              id="channel-name" 
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Your channel name" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password" 
              required 
            />
          </div>
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked === true)}
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-tight">
              I agree to the MiyTube Terms of Service and Creator Policies
            </Label>
          </div>
          
          <Button type="submit" className="w-full">Create Channel</Button>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have a channel?{" "}
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto">Log in</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log in to your channel</DialogTitle>
                  <DialogDescription>
                    Enter your credentials to access your creator account
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleLogin} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type="password" required />
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Log in</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </div>
  );
};
