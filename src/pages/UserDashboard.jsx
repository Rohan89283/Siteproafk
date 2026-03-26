import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { signOut } from '../lib/auth'
import UserShortlinks from '../components/UserShortlinks'
import UserStats from '../components/UserStats'
import ProfileSidebar from '../components/ProfileSidebar'
import './UserDashboard.css'

function UserDashboard({ user, onAuthChange }) {
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    onAuthChange()
  }

  const isLinksPage = location.pathname === '/dashboard'
  const isStatsPage = location.pathname === '/dashboard/stats'

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
          <ProfileSidebar user={user} onSignOut={handleSignOut} isAdmin={false} />
        </div>
      </nav>

      <div className="dashboard-tabs">
        <Link
          to="/dashboard"
          className={`dashboard-tab ${isLinksPage ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="tab-label">My Links</span>
        </Link>
        <Link
          to="/dashboard/stats"
          className={`dashboard-tab ${isStatsPage ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="tab-label">Statistics</span>
        </Link>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<UserShortlinks />} />
          <Route path="/stats" element={<UserStats />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  )
}

export default UserDashboard
