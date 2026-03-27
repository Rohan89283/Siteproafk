import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const setUserContext = async (userId, userRole) => {
  if (!userId || !userRole) return

  try {
    await supabase.rpc('set_user_context', {
      user_id: userId,
      user_role: userRole
    })
  } catch (error) {
    console.error('Failed to set user context:', error)
  }
}
