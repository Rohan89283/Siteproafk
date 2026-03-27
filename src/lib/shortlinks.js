import { supabase } from './supabase'

function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function createShortlink(destinationUrl, customCode = null, userId) {
  const shortCode = customCode || generateShortCode()

  const { data: existing } = await supabase
    .from('shortlinks')
    .select('id')
    .eq('short_code', shortCode)
    .maybeSingle()

  if (existing) {
    throw new Error('Short code already exists. Please choose another.')
  }

  const { data, error } = await supabase
    .from('shortlinks')
    .insert([{
      short_code: shortCode,
      original_url: destinationUrl,
      user_id: userId
    }])
    .select()
    .single()

  if (error) {
    console.error('Shortlink creation error:', error)
    throw new Error(error.message || 'Failed to create shortlink')
  }

  return data
}

export async function getMyShortlinks(userId) {
  const { data, error } = await supabase
    .from('shortlinks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch shortlinks')
  }

  return data
}

export async function updateShortlink(id, updates) {
  const { data, error } = await supabase
    .from('shortlinks')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update shortlink')
  }

  return data
}

export async function deleteShortlink(id) {
  const { error } = await supabase
    .from('shortlinks')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Failed to delete shortlink')
  }
}

export async function toggleShortlinkStatus(id, isActive) {
  return updateShortlink(id, { is_active: isActive })
}
