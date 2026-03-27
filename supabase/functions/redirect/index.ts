import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const appUrl = Deno.env.get('VITE_APP_URL') || 'https://gojosatoruafk.com';

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);

    let shortCode = '';
    if (pathParts.length > 0) {
      shortCode = pathParts[pathParts.length - 1];
    }

    if (!shortCode || shortCode === 'redirect') {
      return new Response(null, {
        status: 301,
        headers: { "Location": appUrl },
      });
    }

    const { data: shortlink, error } = await supabase
      .from('shortlinks')
      .select('id, original_url, redirect_type')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !shortlink) {
      return new Response(null, {
        status: 301,
        headers: { "Location": appUrl },
      });
    }

    supabase.rpc('increment_shortlink_clicks', { shortlink_id: shortlink.id }).catch(() => {});

    return new Response(null, {
      status: 301,
      headers: {
        "Location": shortlink.original_url,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error('Redirect error:', err);
    return new Response(null, {
      status: 301,
      headers: { "Location": appUrl },
    });
  }
});
