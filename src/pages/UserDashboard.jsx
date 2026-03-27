import { useState, useEffect } from 'react'
import { signOut } from '../lib/auth'
import { getMyShortlinks } from '../lib/shortlinks'
import ShortlinkForm from '../components/ShortlinkForm'
import ShortlinkCard from '../components/ShortlinkCard'
import ThemeToggle from '../components/ThemeToggle'
import '../components/Dashboard.css'

export default function UserDashboard({ user, onAuthChange }) {
  const [shortlinks, setShortlinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState(null)

  useEffect(() => {
    loadShortlinks()
  }, [])

  async function loadShortlinks() {
    setLoading(true)
    try {
      const data = await getMyShortlinks(user.id)
      setShortlinks(data)
    } catch (error) {
      console.error('Failed to load shortlinks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await signOut()
    onAuthChange()
  }

  if (loading) {
    return <div className="loading-screen"><div className="loader"></div></div>
  }

  const totalClicks = shortlinks.reduce((sum, link) => sum + (link.click_count || 0), 0)
  const activeLinks = shortlinks.filter(link => link.is_active).length

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>GojoSatoruAFK</h1>
            <span className="role-badge user">User</span>
          </div>
          <div className="header-right">
            <ThemeToggle />
            <button onClick={handleLogout} className="btn-secondary">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <main className="main-content full-width">
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-icon">🔗</div>
              <div className="stat-value">{shortlinks.length}</div>
              <div className="stat-label">Total Links</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{activeLinks}</div>
              <div className="stat-label">Active Links</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👆</div>
              <div className="stat-value">{totalClicks}</div>
              <div className="stat-label">Total Clicks</div>
            </div>
          </div>

          <div className="content-header">
            <h2>My Shortlinks</h2>
            <button onClick={() => setShowForm(true)} className="btn-primary">+ Create Shortlink</button>
          </div>

          <div className="shortlinks-grid">
            {shortlinks.map(link => (
              <ShortlinkCard key={link.id} shortlink={link} onEdit={setEditingLink} onReload={loadShortlinks} />
            ))}
            {shortlinks.length === 0 && (
              <div className="empty-state"><p>No shortlinks created yet. Click "Create Shortlink" to get started!</p></div>
            )}
          </div>
        </main>
      </div>

      {showForm && <ShortlinkForm userId={user.id} onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); loadShortlinks(); }} />}
      {editingLink && <ShortlinkForm userId={user.id} shortlink={editingLink} onClose={() => setEditingLink(null)} onSuccess={() => { setEditingLink(null); loadShortlinks(); }} />}
    </div>
  )
}
