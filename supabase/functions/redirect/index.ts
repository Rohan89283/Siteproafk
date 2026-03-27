import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const shortCode = url.pathname.split('/').pop();

    if (!shortCode) {
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Location": Deno.env.get('VITE_APP_URL') || '/',
        },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { data: shortlink, error } = await supabase
      .from('shortlinks')
      .select('id, original_url, is_active')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !shortlink) {
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Location": Deno.env.get('VITE_APP_URL') || '/',
        },
      });
    }

    supabase
      .rpc('increment_clicks', { shortlink_id: shortlink.id })
      .then(() => {})
      .catch(() => {});

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": shortlink.original_url,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": Deno.env.get('VITE_APP_URL') || '/',
      },
    });
  }
});
