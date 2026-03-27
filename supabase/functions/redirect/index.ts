import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const appUrl = 'https://gojosatoruafk.com';

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const shortCode = url.searchParams.get('code');

    if (!shortCode) {
      return new Response(
        JSON.stringify({ error: 'Missing short code', url: appUrl }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: shortlink, error } = await supabase
      .from('shortlinks')
      .select('id, original_url, redirect_type')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !shortlink) {
      return new Response(
        JSON.stringify({ url: appUrl }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    supabase.rpc('increment_shortlink_clicks', { shortlink_id: shortlink.id }).catch(() => {});

    return new Response(
      JSON.stringify({ url: shortlink.original_url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Redirect error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal error', url: appUrl }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
