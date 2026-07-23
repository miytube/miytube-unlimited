import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MailCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'validating' | 'valid' | 'invalid' | 'already' | 'success' | 'error'>('validating');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const validate = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          {
            headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
          }
        );
        const data = await response.json();
        if (response.ok && data.valid) {
          setStatus('valid');
        } else if (data.reason === 'already_unsubscribed') {
          setStatus('already');
        } else {
          setStatus('invalid');
        }
      } catch {
        setStatus('error');
      }
    };

    validate();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('handle-email-unsubscribe', {
        body: { token },
      });
      if (error) {
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MailCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Email Preferences</CardTitle>
            <CardDescription>Manage your MiyTube email subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {status === 'validating' && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Validating your request...</p>
              </div>
            )}

            {status === 'valid' && (
              <>
                <p className="text-muted-foreground">
                  You're about to unsubscribe from MiyTube marketing and notification emails. You can resubscribe anytime from your account settings.
                </p>
                <Button onClick={handleConfirm} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    'Confirm Unsubscribe'
                  )}
                </Button>
              </>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="font-medium">You've been unsubscribed</p>
                <p className="text-sm text-muted-foreground">
                  You won't receive marketing emails from us anymore. Account-related emails may still be sent.
                </p>
              </div>
            )}

            {status === 'already' && (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="font-medium">Already unsubscribed</p>
                <p className="text-sm text-muted-foreground">
                  This email address is already unsubscribed from marketing emails.
                </p>
              </div>
            )}

            {(status === 'invalid' || status === 'error') && (
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="font-medium">Unable to process request</p>
                <p className="text-sm text-muted-foreground">
                  The unsubscribe link is invalid or expired. Please check your email for a newer message or contact support.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Unsubscribe;
