import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, Building2, User, DollarSign, MessageSquare, CheckCircle2 } from 'lucide-react';

const budgetOptions = [
  '$500 - $2,000',
  '$2,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
];

export const ContactSales = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    budget_range: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('advertiser_inquiries').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      budget_range: form.budget_range || null,
      message: form.message.trim() || null,
    });

    setLoading(false);

    if (error) {
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: 'Inquiry sent!',
      description: "We'll get back to you at miytube@aol.com within 1-2 business days.",
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Thank you!</h3>
        <p className="text-muted-foreground max-w-md">
          Your inquiry has been sent to our team at{' '}
          <a href="mailto:miytube@aol.com" className="text-primary underline">miytube@aol.com</a>.
          We'll reach out within 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Contact Info Card */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Contact Our Sales Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Looking for custom ad packages, bulk pricing, or enterprise solutions? Our sales team is ready to help mid-size and large advertisers get the most out of MiyTube.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a href="mailto:miytube@aol.com" className="font-medium text-primary hover:underline">
                  miytube@aol.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="font-medium">1-2 business days</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Custom Budgets</p>
                <p className="font-medium">$500 and up</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Send an Inquiry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Your full name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="you@company.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="Your company name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_range">Monthly Budget</Label>
              <select
                id="budget_range"
                name="budget_range"
                value={form.budget_range}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a budget range</option>
                {budgetOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                placeholder="Tell us about your advertising goals..."
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Inquiry'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
