
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const LOCAL_BUSINESS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MiyTube',
  url: 'https://www.miytube.com/contact',
  email: 'miytube@aol.com',
};

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }).max(100, { message: 'Name must be less than 100 characters' }),
  email: z.string().trim().email({ message: 'Invalid email address' }).max(255, { message: 'Email must be less than 255 characters' }),
  subject: z.string().min(1, { message: 'Please select a subject' }),
  message: z.string().trim().min(1, { message: 'Message is required' }).max(2000, { message: 'Message must be less than 2000 characters' }),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  usePageSEO({
    title: 'Contact MiyTube — Get in touch with our team',
    description: 'Contact MiyTube support, business, or press. Email, phone, and headquarters address for help with your account or partnership inquiries.',
    path: '/contact',
  });

  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof ContactForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-form-submission',
          recipientEmail: 'miytubembh@gmail.com',
          idempotencyKey: `contact-${form.email}-${Date.now()}`,
          templateData: {
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
          },
        },
      });

      if (error) {
        console.error('Failed to send contact email:', error);
        toast({
          title: 'Message failed to send',
          description: 'Please try again or email us directly at support@miytube.com.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Message sent',
        description: "We've received your message and will get back to you soon.",
      });

      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      toast({
        title: 'Message failed to send',
        description: 'Please try again or email us directly at support@miytube.com.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSONLD) }}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name" 
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="John Doe" 
                        required 
                        maxLength={100}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john.doe@example.com" 
                        required 
                        maxLength={255}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={form.subject} onValueChange={(value) => handleChange('subject', value)} required>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="copyright">Copyright Issue</SelectItem>
                        <SelectItem value="business">Business Opportunity</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea 
                      id="message" 
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="How can we help you?" 
                      rows={6} 
                      required 
                      maxLength={2000}
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Here are the ways you can reach out to us directly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-sm text-muted-foreground">support@miytube.com</p>
                    <p className="text-sm text-muted-foreground">business@miytube.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm PST</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Visit Us</h3>
                    <p className="text-sm text-muted-foreground">MiyTube Headquarters</p>
                    <p className="text-sm text-muted-foreground">123 Tech Lane</p>
                    <p className="text-sm text-muted-foreground">San Francisco, CA 94107</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <h3 className="font-medium mb-2">Our Social Media</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Twitter
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    LinkedIn
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Instagram
                  </a>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
