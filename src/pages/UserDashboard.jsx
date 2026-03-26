import { Routes, Route, Navigate } from 'react-router-dom'
import { signOut } from '../lib/auth'
import ShortlistsManager from '../components/ShortlistsManager'
import ShortlinksView from '../components/ShortlinksView'
import './UserDashboard.css'

function UserDashboard({ user }) {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <div className="nav-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span>ShortLink Manager</span>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-email">{user.email}</span>
              <span className="user-role badge badge-primary">User</span>
            </div>
          </div>
          <button onClick={handleSignOut} className="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" />
            </svg>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<ShortlistsManager userId={user.id} />} />
          <Route path="/shortlist/:shortlistId" element={<ShortlinksView userId={user.id} />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  )
}

export default UserDashboard
