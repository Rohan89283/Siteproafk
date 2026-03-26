import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to set user context for RLS policies
export const setUserContext = async (userId) => {
  if (!userId) return;

  const { error } = await supabase.rpc('set_user_context', {
    user_id: userId
  });

  if (error) console.error('Error setting user context:', error);
}
