import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfileSidebar.css'

function ProfileSidebar({ user, onSignOut, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleSignOut = () => {
    setIsOpen(false)
    onSignOut()
  }

  const handleDashboard = () => {
    setIsOpen(false)
    if (isAdmin) {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <>
      <div className="profile-trigger" onClick={toggleSidebar}>
        <div className={`user-avatar ${isAdmin ? 'admin' : ''}`}>
          {user.username.charAt(0).toUpperCase()}
        </div>
      </div>

      {isOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
          <div className={`profile-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div className={`sidebar-avatar ${isAdmin ? 'admin' : ''}`}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <h3>{user.username}</h3>
                <span className={`badge ${isAdmin ? 'badge-warning' : 'badge-primary'}`}>
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-menu">
              <button onClick={handleDashboard} className="sidebar-menu-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Dashboard</span>
              </button>
              <button onClick={handleSignOut} className="sidebar-menu-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ProfileSidebar
