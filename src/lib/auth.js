import { supabase, setUserContext } from './supabase';
import bcrypt from 'bcryptjs';

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
    // Fetch user by username
    const { data: user, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    if (!user) throw new Error('Invalid username or password');

    // Compare password with hash
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new Error('Invalid username or password');

    // Set session
    setSession(user);

    return { user, error: null };
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

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from('app_users')
      .insert([{
        username,
        password_hash,
        role,
        created_by: currentUser.id
      }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
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
    const password_hash = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from('app_users')
      .update({ password_hash })
      .eq('id', userId);

    if (error) throw error;

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
