import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { Table } from 'npm:poker-ts@1.5.0';
import { applyAction, newTournament, nextHand, tournamentView, type PokerConstructor, type TournamentState } from '../_shared/tournamentEngine.ts';

const Engine = Table as unknown as PokerConstructor;
const RequestSchema = z.object({
  operation: z.enum(['current', 'start', 'step', 'action', 'next']),
  tournamentId: z.string().uuid().optional(), version: z.number().int().positive().optional(),
  action: z.enum(['fold', 'check', 'call', 'bet', 'raise']).optional(),
  amount: z.number().int().min(0).max(60_000).optional(),
}).strict();
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const authorization = req.headers.get('Authorization');
  if (!url || !anon || !key) return reply({ error: 'Tournament unavailable' }, 503);
  if (!authorization?.startsWith('Bearer ')) return reply({ error: 'Sign in to play' }, 401);
  const member = createClient(url, anon, { global: { headers: { Authorization: authorization } } });
  const { data: auth, error: authError } = await member.auth.getUser();
  if (authError || !auth.user) return reply({ error: 'Sign in to play' }, 401);
  const admin = createClient(url, key);
  try {
    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) return reply({ error: 'Invalid tournament request' }, 400);
    const input = parsed.data;
    const { data: row, error: readError } = await admin.from('poker_tournament_sessions').select('state,version').eq('user_id', auth.user.id).maybeSingle();
    if (readError) throw readError;
    let state = row?.state as TournamentState | undefined;
    let version = row?.version ?? 0;
    if (input.operation === 'current') return reply({ tournament: state ? tournamentView(state, version, Engine) : null });
    if (input.operation === 'start' && state?.status === 'playing') return reply({ tournament: tournamentView(state, version, Engine) });
    if (input.operation !== 'start' && (!state || input.tournamentId !== state.id || input.version !== version)) return reply({ error: 'The table changed. Refreshing your hand.', conflict: true }, 409);
    if (input.operation === 'start' && state && (input.tournamentId !== state.id || input.version !== version)) return reply({ error: 'The table changed. Refreshing your hand.', conflict: true }, 409);
    if (input.operation === 'start') state = newTournament();
    else if (state && input.operation === 'next') state = nextHand(state, Engine);
    else if (state && input.operation === 'step') {
      if (input.action || input.amount !== undefined) return reply({ error: 'Invalid bot request' }, 400);
      state = applyAction(state, Engine);
    } else if (state) {
      if (!input.action) return reply({ error: 'Choose an action' }, 400);
      state = applyAction(state, Engine, input.action, input.amount);
    }
    if (!state) return reply({ error: 'Start a tournament first' }, 400);
    if (!row) {
      const { error } = await admin.from('poker_tournament_sessions').insert({ user_id: auth.user.id, state, version: 1 });
      if (error?.code === '23505') return reply({ error: 'The table changed. Refreshing your hand.', conflict: true }, 409);
      if (error) throw error;
      version = 1;
    } else {
      const { data: saved, error } = await admin.from('poker_tournament_sessions').update({ state, version: version + 1, updated_at: new Date().toISOString() }).eq('user_id', auth.user.id).eq('version', version).select('version').maybeSingle();
      if (error) throw error;
      if (!saved) return reply({ error: 'The table changed. Refreshing your hand.', conflict: true }, 409);
      version = saved.version;
    }
    return reply({ tournament: tournamentView(state, version, Engine) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Tournament unavailable. Please try again.';
    const safe = /^(Choose|Wait|That action|Only bets|Start the next|Finish this|Tournament is over|Hand action)/.test(message);
    return reply({ error: safe ? message : 'Tournament unavailable. Please try again.' }, safe ? 400 : 500);
  }
});