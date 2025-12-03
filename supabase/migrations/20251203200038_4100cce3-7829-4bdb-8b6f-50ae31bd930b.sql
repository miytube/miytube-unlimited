-- Create music_videos table with analytics fields
CREATE TABLE public.music_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  category TEXT,
  subcategory TEXT,
  tags TEXT[],
  duration TEXT,
  
  -- Real user interaction metrics
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  watch_time_seconds INTEGER NOT NULL DEFAULT 0,
  click_through_rate DECIMAL(5,4) DEFAULT 0,
  conversion_rate DECIMAL(5,4) DEFAULT 0,
  
  -- AI-analyzed scores (0-100)
  thumbnail_quality_score INTEGER DEFAULT 0,
  content_clarity_score INTEGER DEFAULT 0,
  title_effectiveness_score INTEGER DEFAULT 0,
  
  -- Traffic source tracking
  traffic_organic INTEGER DEFAULT 0,
  traffic_search INTEGER DEFAULT 0,
  traffic_external INTEGER DEFAULT 0,
  traffic_suggested INTEGER DEFAULT 0,
  
  -- Calculated featured score
  featured_score DECIMAL(10,2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.music_videos ENABLE ROW LEVEL SECURITY;

-- Public read access for featured videos
CREATE POLICY "Anyone can view music videos"
ON public.music_videos
FOR SELECT
USING (true);

-- Users can insert their own videos
CREATE POLICY "Users can insert their own music videos"
ON public.music_videos
FOR INSERT
WITH CHECK (true);

-- Users can update their own videos
CREATE POLICY "Users can update their own music videos"
ON public.music_videos
FOR UPDATE
USING (true);

-- Create function to calculate featured score
CREATE OR REPLACE FUNCTION public.calculate_featured_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.featured_score := (
    (NEW.views * 0.15) +
    (NEW.likes * 0.20) +
    (NEW.shares * 0.15) +
    (NEW.click_through_rate * 100 * 0.10) +
    (NEW.conversion_rate * 100 * 0.10) +
    (NEW.thumbnail_quality_score * 0.15) +
    (NEW.content_clarity_score * 0.10) +
    (NEW.title_effectiveness_score * 0.05)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic score calculation
CREATE TRIGGER calculate_featured_score_trigger
BEFORE INSERT OR UPDATE ON public.music_videos
FOR EACH ROW
EXECUTE FUNCTION public.calculate_featured_score();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_music_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for timestamp updates
CREATE TRIGGER update_music_videos_updated_at
BEFORE UPDATE ON public.music_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_music_videos_updated_at();