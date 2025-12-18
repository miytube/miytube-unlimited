-- Add local_id column to track the original upload ID
ALTER TABLE public.uploaded_videos 
ADD COLUMN local_id TEXT;

-- Create index for faster lookups by local_id
CREATE INDEX idx_uploaded_videos_local_id ON public.uploaded_videos(local_id);