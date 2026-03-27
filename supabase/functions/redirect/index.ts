import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const appUrl = Deno.env.get('VITE_APP_URL') || '/';

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(p => p);
  const shortCode = pathParts[pathParts.length - 1];

  if (!shortCode || shortCode === 'redirect') {
    return new Response(null, {
      status: 301,
      headers: { "Location": appUrl },
    });
  }

  try {
    const { data: shortlink } = await supabase
      .from('shortlinks')
      .select('id, original_url')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .maybeSingle();

    if (!shortlink) {
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
        "Cache-Control": "public, max-age=3600, immutable",
      },
    });
  } catch {
    return new Response(null, {
      status: 301,
      headers: { "Location": appUrl },
    });
  }
});
