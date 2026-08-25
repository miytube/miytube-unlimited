DROP POLICY IF EXISTS "room messages are public" ON public.cha_room_messages;
CREATE POLICY "room messages readable in active public rooms"
ON public.cha_room_messages
FOR SELECT
TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.cha_rooms r WHERE r.id = cha_room_messages.room_id AND r.is_active));

CREATE POLICY "Users can view their own session"
ON public.active_sessions
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());