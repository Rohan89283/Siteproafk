import { supabase, setUserContext } from './supabase'

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth`
const SESSION_KEY = 'shortlink_session'

export const getSession = () => {
  const session = localStorage.getItem(SESSION_KEY)
  return session ? JSON.parse(session) : null
}

const setSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  setUserContext(user.id, user.role)
}

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
}

export const signIn = async (username, password) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ action: 'signin', username, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign in')
    }

    setSession(data.user)
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

export const signOut = async () => {
  clearSession()
  return { error: null }
}

export const getCurrentUser = () => {
  const session = getSession()
  if (session) {
    setUserContext(session.id, session.role)
  }
  return session
}

export const createUser = async (username, password, role = 'user') => {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only admins can create users')
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
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create user')
    }

    return { data: result.data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const deleteUser = async (userId) => {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only admins can delete users')
    }

    const { error } = await supabase
      .from('app_users')
      .delete()
      .eq('id', userId)

    if (error) throw error

    return { error: null }
  } catch (error) {
    return { error }
  }
}

export const initializeAuth = () => {
  const user = getCurrentUser()
  if (user) {
    setUserContext(user.id, user.role)
  }
}
