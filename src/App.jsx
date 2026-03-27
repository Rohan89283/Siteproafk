import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCurrentUser, initializeAuth } from './lib/auth'
import Auth from './pages/Auth'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

function RedirectHandler() {
  const { shortCode } = useParams()
  const [error, setError] = useState(null)

  useEffect(() => {
    async function redirect() {
      if (!shortCode) {
        setError('No shortcode provided')
        setTimeout(() => window.location.replace('/'), 2000)
        return
      }

      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redirect?code=${shortCode}`
        console.log('Fetching redirect URL:', url)

        const response = await fetch(url)
        const data = await response.json()

        console.log('Redirect response:', data)

        if (data.url) {
          window.location.replace(data.url)
        } else if (data.error) {
          setError(data.error)
          setTimeout(() => window.location.replace('/'), 2000)
        } else {
          setError('Invalid shortlink')
          setTimeout(() => window.location.replace('/'), 2000)
        }
      } catch (error) {
        console.error('Redirect failed:', error)
        setError('Failed to load shortlink')
        setTimeout(() => window.location.replace('/'), 2000)
      }
    }
    redirect()
  }, [shortCode])

  if (error) {
    return (
      <div className="loading-screen">
        <p style={{ color: '#ff4444', marginTop: '20px' }}>{error}</p>
        <p style={{ fontSize: '14px', marginTop: '10px' }}>Redirecting to home...</p>
      </div>
    )
  }

  return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p style={{ marginTop: '20px' }}>Redirecting...</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/r/:shortCode" element={<RedirectHandler />} />
        <Route path="/*" element={<AuthenticatedApp />} />
      </Routes>
    </BrowserRouter>
  )
}

function AuthenticatedApp() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const handleAuthChange = () => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/dashboard" /> : <Auth onAuthChange={handleAuthChange} />}
      />
      <Route
        path="/dashboard/*"
        element={
          user ? (
            user.role === 'admin' ? (
              <AdminDashboard user={user} onAuthChange={handleAuthChange} />
            ) : (
              <UserDashboard user={user} onAuthChange={handleAuthChange} />
            )
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/auth"} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
