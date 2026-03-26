import { supabase } from './supabase';
import { getCurrentUser, isAdmin } from './auth';

// Generate random short code
const generateShortCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ============ SHORTLISTS ============

export const getShortlists = async () => {
  try {
    const { data, error } = await supabase
      .from('shortlists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createShortlist = async (name) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('shortlists')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateShortlist = async (id, name) => {
  try {
    const { data, error } = await supabase
      .from('shortlists')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteShortlist = async (id) => {
  try {
    const { error } = await supabase
      .from('shortlists')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// ============ SHORTLINKS ============

export const getShortlinks = async (shortlistId = null) => {
  try {
    let query = supabase
      .from('shortlinks')
      .select('*')
      .order('created_at', { ascending: false });

    if (shortlistId) {
      query = query.eq('shortlist_id', shortlistId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getShortlinkByCode = async (code) => {
  try {
    const { data, error } = await supabase
      .from('shortlinks')
      .select('*')
      .eq('short_code', code)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createShortlink = async (destinationUrl, customCode = null, shortlistId = null) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    let code = customCode;
    if (!code) {
      let isUnique = false;
      while (!isUnique) {
        code = generateShortCode();
        const { data: existing } = await supabase
          .from('shortlinks')
          .select('id')
          .eq('short_code', code)
          .maybeSingle();
        if (!existing) isUnique = true;
      }
    }

    const insertData = {
      short_code: code,
      original_url: destinationUrl,
      user_id: user.id
    };

    if (shortlistId) {
      insertData.shortlist_id = shortlistId;
    }

    const { data, error } = await supabase
      .from('shortlinks')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateShortlink = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('shortlinks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const toggleShortlink = async (id, isActive) => {
  return updateShortlink(id, { is_active: isActive });
};

export const deleteShortlink = async (id) => {
  try {
    const { error } = await supabase
      .from('shortlinks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const incrementClicks = async (id) => {
  try {
    // Get current click count
    const { data: link } = await supabase
      .from('shortlinks')
      .select('click_count')
      .eq('id', id)
      .single();

    if (!link) return;

    // Increment
    await supabase
      .from('shortlinks')
      .update({ click_count: (link.click_count || 0) + 1 })
      .eq('id', id);

  } catch (error) {
    console.error('Error incrementing clicks:', error);
  }
};

// ============ STATS ============

export const getStats = async () => {
  try {
    if (!isAdmin()) {
      throw new Error('Only admins can view stats');
    }

    // Get all users count
    const { count: usersCount } = await supabase
      .from('app_users')
      .select('*', { count: 'exact', head: true });

    // Get all shortlinks count
    const { count: shortlinksCount } = await supabase
      .from('shortlinks')
      .select('*', { count: 'exact', head: true });

    // Get total clicks
    const { data: links } = await supabase
      .from('shortlinks')
      .select('click_count');

    const totalClicks = links?.reduce((sum, link) => sum + (link.click_count || 0), 0) || 0;

    return {
      data: {
        totalUsers: usersCount || 0,
        totalShortlinks: shortlinksCount || 0,
        totalClicks
      },
      error: null
    };
  } catch (error) {
    return { data: null, error };
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    if (!isAdmin()) {
      throw new Error('Only admins can view all users');
    }

    const { data, error } = await supabase
      .from('app_users')
      .select('id, username, role, created_at')
      .order('created_at', { ascending: false});

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
