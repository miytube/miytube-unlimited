import React, { useState } from 'react';
import { z } from 'zod';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'Please enter your email address' })
  .email({ message: 'Please enter a valid email address' })
  .max(255, { message: 'Email must be less than 255 characters' });

interface NewsletterSignupProps {
  variant?: 'inline' | 'card';
  heading?: string;
  description?: string;
  source?: string;
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'card',
  heading = 'Subscribe to MiyTube',
  description = 'Get new videos, trending clips and site updates in your inbox. Free — unsubscribe anytime.',
  source = 'miytube',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: parsed.data.toLowerCase(), source });
    setLoading(false);

    if (error) {
      // Duplicate signups are treated as success
      if (error.code === '23505') {
        setDone(true);
        toast.success("You're already subscribed — thanks!");
        return;
      }
      toast.error('Could not subscribe right now. Please try again.');
      return;
    }

    // Notify the site owner (best-effort, never blocks the subscriber)
    void supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: source === 'iwantinformationnow' ? 'new-subscriber-iwin' : 'new-subscriber-miytube',
        idempotencyKey: `subscriber-${source}-${parsed.data.toLowerCase()}`,
        templateData: {
          subscriberEmail: parsed.data.toLowerCase(),
          site: source,
          subscribedAt: new Date().toISOString(),
        },
      },
    });

    setDone(true);
    setEmail('');
    toast.success('Subscribed! Thanks for joining.');
  };


  if (done) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>You&apos;re on the list. Watch your inbox.</span>
      </div>
    );
  }

  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <label htmlFor={`newsletter-email-${source}`} className="sr-only">
        Email address
      </label>
      <Input
        id={`newsletter-email-${source}`}
        type="email"
        inputMode="email"
        autoComplete="email"
        maxLength={255}
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="sm:flex-1"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Subscribing…' : 'Subscribe'}
      </Button>
    </form>
  );

  if (variant === 'inline') {
    return <div className={className}>{form}</div>;
  }

  return (
    <section className={`rounded-lg border bg-card p-5 ${className}`} aria-labelledby={`newsletter-heading-${source}`}>
      <div className="flex items-center gap-2 mb-1">
        <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
        <h3 id={`newsletter-heading-${source}`} className="font-semibold">
          {heading}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {form}
      <p className="text-xs text-muted-foreground mt-2">
        We never share your email. Unsubscribe anytime.
      </p>
    </section>
  );
};

export default NewsletterSignup;
