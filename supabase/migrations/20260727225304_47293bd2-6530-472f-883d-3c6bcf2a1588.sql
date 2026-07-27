CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, channel_name, display_name)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data ->> 'channel_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'channel_name', '')
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;