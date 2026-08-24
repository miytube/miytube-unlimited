import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('Authorization') ?? '';
    const userClient = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: 'Unauthorized' }, 401);

    const admin = createClient(url, service);
    const { data: roleRow } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) return json({ error: 'Admin only' }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body.action ?? 'list';

    if (action === 'list') {
      const page = Number(body.page ?? 1);
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;

      const ids = data.users.map((u) => u.id);
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        admin.from('profiles').select('user_id, channel_name, display_name').in('user_id', ids),
        admin.from('user_roles').select('user_id, role').in('user_id', ids),
      ]);

      const users = data.users.map((u) => {
        const p = profiles?.find((x) => x.user_id === u.id);
        return {
          id: u.id,
          email: u.email ?? '',
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          email_confirmed: Boolean(u.email_confirmed_at ?? (u as any).confirmed_at),
          banned: Boolean((u as any).banned_until && new Date((u as any).banned_until) > new Date()),
          channel_name: p?.channel_name ?? p?.display_name ?? null,
          role: roles?.find((x) => x.user_id === u.id)?.role ?? 'user',
        };
      });

      return json({ users });
    }

    const targetId = body.target_user_id as string | undefined;
    if (!targetId) return json({ error: 'Missing target_user_id' }, 400);

    if (action === 'confirm') {
      const { error } = await admin.auth.admin.updateUserById(targetId, { email_confirm: true });
      if (error) throw error;
      return json({ success: true });
    }

    if (action === 'resend') {
      const { data: target, error: getErr } = await admin.auth.admin.getUserById(targetId);
      if (getErr) throw getErr;
      const email = target.user?.email;
      if (!email) return json({ error: 'User has no email' }, 400);
      const siteUrl = (body.redirect_to as string) || url;
      const { error } = await admin.auth.admin.generateLink({
        type: 'signup',
        email,
        options: { redirectTo: siteUrl },
      });
      if (error) throw error;
      return json({ success: true });
    }

    if (action === 'ban' || action === 'unban') {
      const { error } = await admin.auth.admin.updateUserById(targetId, {
        ban_duration: action === 'ban' ? '87600h' : 'none',
      } as any);
      if (error) throw error;
      return json({ success: true });
    }

    if (action === 'delete') {
      if (targetId === userData.user.id) return json({ error: 'You cannot delete your own account' }, 400);
      const { error } = await admin.auth.admin.deleteUser(targetId);
      if (error) throw error;
      return json({ success: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e: any) {
    console.error('admin-manage-users error', e);
    return json({ error: e?.message ?? String(e) }, 500);
  }
});
