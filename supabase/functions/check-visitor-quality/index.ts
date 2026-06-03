import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Known datacenter / hosting / VPN org name fragments. Lowercase match.
const DATACENTER_ORGS = [
  'amazon', 'aws', 'google cloud', 'google llc', 'microsoft', 'azure',
  'digitalocean', 'linode', 'akamai', 'cloudflare', 'fastly', 'ovh',
  'hetzner', 'vultr', 'oracle', 'alibaba', 'tencent', 'baidu', 'huawei',
  'leaseweb', 'choopa', 'colocrossing', 'datacamp', 'm247', 'contabo',
  'scaleway', 'online s.a.s', 'serverius', 'psychz', 'quadranet',
  'hostinger', 'godaddy', 'namecheap', 'hosting', 'datacenter', 'data center',
  'server', 'cloud', 'vps', 'colo', 'proxy', 'vpn',
];

const CACHE_TTL_DAYS = 7;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip === '::1') {
      return new Response(
        JSON.stringify({ ip, is_datacenter: false, is_proxy: false, cached: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Check cache
    const { data: cached } = await supabase
      .from('visitor_ip_cache')
      .select('*')
      .eq('ip', ip)
      .maybeSingle();

    const cacheFresh =
      cached &&
      (Date.now() - new Date(cached.checked_at).getTime()) <
        CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

    if (cacheFresh) {
      return new Response(
        JSON.stringify({
          ip,
          is_datacenter: cached.is_datacenter,
          is_proxy: cached.is_proxy,
          country: cached.country,
          org: cached.org,
          cached: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Lookup via ip-api.com (free, ~45 req/min per source IP — fine with caching)
    let is_datacenter = false;
    let is_proxy = false;
    let country: string | null = null;
    let asn: string | null = null;
    let org: string | null = null;

    try {
      const resp = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,country,as,org,isp,hosting,proxy`
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data.status === 'success') {
          country = data.country || null;
          asn = data.as || null;
          org = data.org || data.isp || null;
          is_datacenter = !!data.hosting;
          is_proxy = !!data.proxy;
          // Fallback org-name match if hosting flag missed
          if (!is_datacenter && org) {
            const lower = (org + ' ' + (data.isp || '')).toLowerCase();
            if (DATACENTER_ORGS.some((k) => lower.includes(k))) {
              is_datacenter = true;
            }
          }
        }
      }
    } catch (err) {
      console.error('ip-api lookup failed:', err);
    }

    // 3. Upsert cache (best-effort)
    await supabase
      .from('visitor_ip_cache')
      .upsert(
        {
          ip,
          is_datacenter,
          is_proxy,
          country,
          asn,
          org,
          checked_at: new Date().toISOString(),
        },
        { onConflict: 'ip' }
      );

    return new Response(
      JSON.stringify({ ip, is_datacenter, is_proxy, country, org, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('check-visitor-quality error:', err);
    return new Response(
      JSON.stringify({ is_datacenter: false, is_proxy: false, error: String(err) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
