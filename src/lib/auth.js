import { supabase, setUserContext } from './supabase';

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth`;

// Session storage
const SESSION_KEY = 'shortlink_session';

export const getSession = () => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

const setSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  setUserContext(user.id, user.role);
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  setUserContext(null);
};

// Sign in with username and password
export const signIn = async (username, password) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ action: 'signin', username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign in');
    }

    setSession(data.user);
    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

// Sign out
export const signOut = async () => {
  clearSession();
  return { error: null };
};

// Get current user from session
export const getCurrentUser = () => {
  const session = getSession();
  if (session) {
    setUserContext(session.id, session.role);
  }
  return session;
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

// Admin: Create new user
export const createUser = async (username, password, role = 'user') => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only admins can create users');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        action: 'create_user',
        username,
        password,
        role,
        createdBy: currentUser.id
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create user');
    }

    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Admin: Delete user
export const deleteUser = async (userId) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only admins can delete users');
    }

    const { error } = await supabase
      .from('app_users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Update password
export const updatePassword = async (userId, newPassword) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        action: 'update_password',
        userId,
        newPassword
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update password');
    }

    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Initialize session on app load
export const initializeAuth = () => {
  const user = getCurrentUser();
  if (user) {
    setUserContext(user.id, user.role);
  }
};
