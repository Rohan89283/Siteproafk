import { supabase } from './supabase'

// Shortlist Operations
export const createShortlist = async (userId, name, description = '') => {
  try {
    const { data, error } = await supabase
      .from('shortlists')
      .insert([
        {
          user_id: userId,
          name,
          description,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getShortlists = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('shortlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const updateShortlist = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('shortlists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const deleteShortlist = async (id) => {
  try {
    const { error } = await supabase
      .from('shortlists')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

// Shortlink Operations
export const createShortlink = async (shortlistId, userId, originalUrl, shortCode, title = '') => {
  try {
    // Check if short code already exists
    const { data: existing } = await supabase
      .from('shortlinks')
      .select('short_code')
      .eq('short_code', shortCode)
      .single()

    if (existing) {
      throw new Error('Short code already exists')
    }

    const { data, error } = await supabase
      .from('shortlinks')
      .insert([
        {
          shortlist_id: shortlistId,
          user_id: userId,
          original_url: originalUrl,
          short_code: shortCode,
          title,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getShortlinks = async (shortlistId) => {
  try {
    const { data, error } = await supabase
      .from('shortlinks')
      .select('*')
      .eq('shortlist_id', shortlistId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getShortlinkByCode = async (shortCode) => {
  try {
    const { data, error } = await supabase
      .from('shortlinks')
      .select('*')
      .eq('short_code', shortCode)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const updateShortlink = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('shortlinks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const deleteShortlink = async (id) => {
  try {
    const { error } = await supabase
      .from('shortlinks')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export const incrementClicks = async (shortlinkId) => {
  try {
    const { data, error } = await supabase.rpc('increment_clicks', {
      shortlink_id: shortlinkId,
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Admin Operations
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getAllShortlinks = async () => {
  try {
    const { data, error } = await supabase
      .from('shortlinks')
      .select(`
        *,
        shortlists (
          name,
          user_id
        ),
        users (
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const updateUserRole = async (userId, role) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getStats = async () => {
  try {
    // Get total users
    const { count: usersCount, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (usersError) throw usersError

    // Get total shortlists
    const { count: shortlistsCount, error: shortlistsError } = await supabase
      .from('shortlists')
      .select('*', { count: 'exact', head: true })

    if (shortlistsError) throw shortlistsError

    // Get total shortlinks
    const { count: shortlinksCount, error: shortlinksError } = await supabase
      .from('shortlinks')
      .select('*', { count: 'exact', head: true })

    if (shortlinksError) throw shortlinksError

    // Get total clicks
    const { data: clicksData, error: clicksError } = await supabase
      .from('shortlinks')
      .select('clicks')

    if (clicksError) throw clicksError

    const totalClicks = clicksData.reduce((sum, link) => sum + (link.clicks || 0), 0)

    return {
      data: {
        totalUsers: usersCount || 0,
        totalShortlists: shortlistsCount || 0,
        totalShortlinks: shortlinksCount || 0,
        totalClicks,
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error }
  }
}
