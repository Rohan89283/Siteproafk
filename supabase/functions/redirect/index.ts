import { createClient } from 'npm:@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing short code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: shortlink, error } = await supabase
      .from('shortlinks')
      .select('id, original_url, is_active')
      .eq('short_code', code)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Database error', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!shortlink) {
      return new Response(
        '<html><body><h1>Shortlink not found</h1><p>Redirecting to home...</p><script>setTimeout(() => window.location.href = "https://gojosatoruafk.com", 2000)</script></body></html>',
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      )
    }

    supabase.rpc('increment_click_count', { shortlink_code: code }).then()

    return new Response(null, {
      status: 302,
      headers: {
        'Location': shortlink.original_url,
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
