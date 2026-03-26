import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCurrentUser, initializeAuth } from './lib/auth'
import Auth from './pages/Auth'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Redirect from './pages/Redirect'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth on app load
    initializeAuth()

    // Check current session
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
        {/* Public redirect route */}
        <Route path="/r/:shortCode" element={<Redirect />} />

        {/* Auth route */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" /> : <Auth onAuthChange={handleAuthChange} />}
        />

        {/* Dashboard routes */}
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

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/auth"} />}
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
