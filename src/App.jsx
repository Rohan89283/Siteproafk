import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCurrentUser, initializeAuth } from './lib/auth'
import Auth from './pages/Auth'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

function RedirectHandler() {
  const { shortCode } = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redirect?code=${shortCode}`
        )

        if (response.redirected) {
          window.location.replace(response.url)
        } else {
          const data = await response.json()
          if (data.url) {
            window.location.replace(data.url)
          } else {
            window.location.replace('/')
          }
        }
      } catch (error) {
        console.error('Redirect error:', error)
        window.location.replace('/')
      }
    }

    handleRedirect()
  }, [shortCode])

  return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Redirecting...</p>
    </div>
  )
}

function App() {
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
    <Router>
      <Routes>
        <Route path="/r/:shortCode" element={<RedirectHandler />} />

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
    </Router>
  )
}

export default App
