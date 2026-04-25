import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const setupToken = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey || !setupToken) {
    return json({ error: 'Backend setup secrets are not configured' }, 500);
  }

  const authHeader = req.headers.get('authorization') ?? '';
  const providedToken = authHeader.replace(/^Bearer\s+/i, '');
  if (providedToken !== setupToken) return json({ error: 'Unauthorized' }, 401);

  const { email, password, username } = await req.json().catch(() => ({}));
  if (email !== 'hayzon1@aol.com' || username !== 'hayzon1' || typeof password !== 'string' || password.length < 1) {
    return json({ error: 'Invalid setup request' }, 400);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let userId: string | null = null;
  let page = 1;
  while (!userId) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return json({ error: error.message }, 500);
    const existing = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      userId = existing.id;
      break;
    }
    if (data.users.length < 1000) break;
    page += 1;
  }

  if (userId) {
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: { username, channel_name: username },
    });
    if (error) return json({ error: error.message }, 500);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, channel_name: username },
    });
    if (error || !data.user) return json({ error: error?.message ?? 'Could not create user' }, 500);
    userId = data.user.id;
  }

  const { data: profile } = await admin.from('profiles').select('id').eq('user_id', userId).maybeSingle();
  if (profile?.id) {
    await admin
      .from('profiles')
      .update({ channel_name: username, display_name: username })
      .eq('user_id', userId);
  } else {
    await admin.from('profiles').insert({ user_id: userId, channel_name: username, display_name: username });
  }

  const { data: currentRoles } = await admin.from('user_roles').select('role').eq('user_id', userId);
  const roleSet = new Set((currentRoles ?? []).map((row) => row.role));
  const missingRoles = ['user', 'admin'].filter((role) => !roleSet.has(role));
  if (missingRoles.length > 0) {
    const { error } = await admin.from('user_roles').insert(missingRoles.map((role) => ({ user_id: userId, role })));
    if (error) return json({ error: error.message }, 500);
  }

  return json({ ok: true, email, username, roles: Array.from(new Set([...roleSet, ...missingRoles])) });
});
