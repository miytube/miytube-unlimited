-- Create breaking_news table for admin-managed news alerts
CREATE TABLE public.breaking_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  source TEXT,
  source_url TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  is_breaking BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.breaking_news ENABLE ROW LEVEL SECURITY;

-- Anyone can view active news
CREATE POLICY "Anyone can view active news"
ON public.breaking_news
FOR SELECT
USING (is_active = true);

-- Admins can view all news
CREATE POLICY "Admins can view all news"
ON public.breaking_news
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert news
CREATE POLICY "Admins can insert news"
ON public.breaking_news
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update news
CREATE POLICY "Admins can update news"
ON public.breaking_news
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete news
CREATE POLICY "Admins can delete news"
ON public.breaking_news
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_breaking_news_updated_at
BEFORE UPDATE ON public.breaking_news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();