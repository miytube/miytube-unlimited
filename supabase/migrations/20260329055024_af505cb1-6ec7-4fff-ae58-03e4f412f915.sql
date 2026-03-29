
-- Create ad campaign status enum
CREATE TYPE public.ad_campaign_status AS ENUM ('draft', 'pending_payment', 'active', 'paused', 'completed', 'rejected');

-- Create ad format enum
CREATE TYPE public.ad_format AS ENUM ('skippable_instream', 'non_skippable_instream', 'bumper', 'discovery', 'banner', 'overlay');

-- Create ad campaigns table
CREATE TABLE public.ad_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  campaign_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_website TEXT,
  ad_format ad_format NOT NULL DEFAULT 'discovery',
  status ad_campaign_status NOT NULL DEFAULT 'draft',
  
  -- Targeting
  target_audience TEXT,
  target_categories TEXT[] DEFAULT '{}',
  target_locations TEXT[] DEFAULT '{}',
  age_range_min INTEGER DEFAULT 18,
  age_range_max INTEGER DEFAULT 65,
  
  -- Creative
  headline TEXT NOT NULL,
  description TEXT,
  call_to_action TEXT DEFAULT 'Learn More',
  destination_url TEXT NOT NULL,
  media_url TEXT,
  thumbnail_url TEXT,
  
  -- Budget & Schedule
  daily_budget NUMERIC(10,2) NOT NULL DEFAULT 10.00,
  total_budget NUMERIC(10,2) NOT NULL DEFAULT 100.00,
  amount_spent NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  cost_per_view NUMERIC(10,4) DEFAULT 0.01,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  
  -- Performance Metrics
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  ctr NUMERIC(5,4) DEFAULT 0,
  
  -- Payment
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT,
  payment_reference TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

-- Users can view their own campaigns
CREATE POLICY "Users can view their own campaigns"
  ON public.ad_campaigns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own campaigns
CREATE POLICY "Users can create campaigns"
  ON public.ad_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own campaigns
CREATE POLICY "Users can update their own campaigns"
  ON public.ad_campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own draft campaigns
CREATE POLICY "Users can delete their draft campaigns"
  ON public.ad_campaigns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'draft');

-- Admins can view all campaigns
CREATE POLICY "Admins can view all campaigns"
  ON public.ad_campaigns FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all campaigns
CREATE POLICY "Admins can update all campaigns"
  ON public.ad_campaigns FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated at trigger
CREATE TRIGGER update_ad_campaigns_updated_at
  BEFORE UPDATE ON public.ad_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
