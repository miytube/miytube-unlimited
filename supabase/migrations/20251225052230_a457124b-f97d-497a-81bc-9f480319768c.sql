-- Add column to store uploader's IP address for duplicate detection
ALTER TABLE public.uploaded_videos 
ADD COLUMN IF NOT EXISTS uploader_ip text;