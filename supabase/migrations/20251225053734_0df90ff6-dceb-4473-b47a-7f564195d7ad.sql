-- Create table for page views analytics
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert page views (for tracking)
CREATE POLICY "Anyone can insert page views" 
ON public.page_views 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view all page views" 
ON public.page_views 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create table for active sessions (for real-time tracking)
CREATE TABLE public.active_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  visitor_ip TEXT,
  current_page TEXT,
  user_id UUID,
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for cleanup queries
CREATE INDEX idx_active_sessions_last_active ON public.active_sessions(last_active_at);

-- Enable RLS
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to upsert sessions
CREATE POLICY "Anyone can insert sessions" 
ON public.active_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update sessions" 
ON public.active_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete sessions" 
ON public.active_sessions 
FOR DELETE 
USING (true);

-- Only admins can view active sessions
CREATE POLICY "Admins can view all sessions" 
ON public.active_sessions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for active sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_sessions;