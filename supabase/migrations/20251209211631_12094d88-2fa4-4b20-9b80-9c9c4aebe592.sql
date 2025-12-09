-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create uploaded_videos table for cloud backup
CREATE TABLE public.uploaded_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  tags TEXT[],
  duration TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  cloud_url TEXT,
  is_cloud_stored BOOLEAN DEFAULT false,
  is_youtube_embed BOOLEAN DEFAULT false,
  youtube_video_id TEXT,
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.uploaded_videos ENABLE ROW LEVEL SECURITY;

-- Anyone can view videos (public content platform)
CREATE POLICY "Anyone can view uploaded videos"
ON public.uploaded_videos
FOR SELECT
USING (true);

-- Authenticated users can insert their own videos
CREATE POLICY "Users can insert their own videos"
ON public.uploaded_videos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own videos
CREATE POLICY "Users can update their own videos"
ON public.uploaded_videos
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own videos
CREATE POLICY "Users can delete their own videos"
ON public.uploaded_videos
FOR DELETE
USING (auth.uid() = user_id);

-- Allow anonymous uploads (for users not logged in)
CREATE POLICY "Allow anonymous video uploads"
ON public.uploaded_videos
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_uploaded_videos_updated_at
BEFORE UPDATE ON public.uploaded_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for uploaded_videos
ALTER PUBLICATION supabase_realtime ADD TABLE public.uploaded_videos;