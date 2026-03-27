import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCurrentUser, initializeAuth } from './lib/auth'
import Auth from './pages/Auth'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

function RedirectHandler() {
  const { shortCode } = useParams()

  useEffect(() => {
    async function redirect() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redirect?code=${shortCode}`
        )
        const data = await response.json()

        if (data.url) {
          window.location.replace(data.url)
        } else {
          window.location.replace('/')
        }
      } catch (error) {
        console.error('Redirect failed:', error)
        window.location.replace('/')
      }
    }
    redirect()
  }, [shortCode])

  return (
    <div className="loading-screen">
      <div className="loader"></div>
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
