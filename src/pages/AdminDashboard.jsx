import { useState, useEffect } from 'react'
import { signOut, createUser, deleteUser } from '../lib/auth'
import { supabase } from '../lib/supabase'
import ShortlinkForm from '../components/ShortlinkForm'
import ShortlinkCard from '../components/ShortlinkCard'
import ThemeToggle from '../components/ThemeToggle'
import '../components/Dashboard.css'

export default function AdminDashboard({ user, onAuthChange }) {
  const [activeTab, setActiveTab] = useState('shortlinks')
  const [users, setUsers] = useState([])
  const [shortlinks, setShortlinks] = useState([])
  const [stats, setStats] = useState({ totalUsers: 0, totalShortlinks: 0, totalClicks: 0 })
  const [loading, setLoading] = useState(true)
  const [showUserForm, setShowUserForm] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newUserRole, setNewUserRole] = useState('user')
  const [userFormError, setUserFormError] = useState('')
  const [showShortlinkForm, setShowShortlinkForm] = useState(false)
  const [editingShortlink, setEditingShortlink] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [usersData, shortlinksData] = await Promise.all([
        supabase.from('app_users').select('*').order('created_at', { ascending: false }),
        supabase.from('shortlinks').select('*, app_users!shortlinks_user_id_fkey(username)').order('created_at', { ascending: false })
      ])

      if (usersData.data) setUsers(usersData.data)
      if (shortlinksData.data) setShortlinks(shortlinksData.data)

      const totalClicks = (shortlinksData.data || []).reduce((sum, link) => sum + (link.click_count || 0), 0)
      setStats({
        totalUsers: usersData.data?.length || 0,
        totalShortlinks: shortlinksData.data?.length || 0,
        totalClicks
      })
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault()
    setUserFormError('')

    try {
      const result = await createUser(newUsername, newPassword, newUserRole)
      if (result.error) throw result.error

      setNewUsername('')
      setNewPassword('')
      setNewUserRole('user')
      setShowUserForm(false)
      loadData()
    } catch (error) {
      setUserFormError(error.message)
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm('Delete this user and all their shortlinks?')) return

    try {
      const result = await deleteUser(userId)
      if (result.error) throw result.error
      loadData()
    } catch (error) {
      alert('Failed to delete user: ' + error.message)
    }
  }

  async function handleLogout() {
    await signOut()
    onAuthChange()
  }

  if (loading) {
    return <div className="dashboard-loading"><div className="spinner"></div></div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>GojoSatoruAFK</h1>
            <span className="role-badge admin">Admin</span>
          </div>
          <div className="header-right">
            <ThemeToggle />
            <button onClick={handleLogout} className="btn-secondary">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <main className="main-content full-width">
          <div className="tabs">
            <button onClick={() => setActiveTab('shortlinks')} className={activeTab === 'shortlinks' ? 'active' : ''}>Shortlinks</button>
            <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Users</button>
            <button onClick={() => setActiveTab('stats')} className={activeTab === 'stats' ? 'active' : ''}>Statistics</button>
          </div>

          {activeTab === 'shortlinks' && (
            <div>
              <div className="content-header">
                <h2>All Shortlinks</h2>
                <button onClick={() => setShowShortlinkForm(true)} className="btn-primary">+ Create Shortlink</button>
              </div>
              <div className="shortlinks-grid">
                {shortlinks.map(link => (
                  <ShortlinkCard key={link.id} shortlink={link} onEdit={setEditingShortlink} onReload={loadData} />
                ))}
                {shortlinks.length === 0 && <div className="empty-state"><p>No shortlinks created yet</p></div>}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="content-header">
                <h2>User Management</h2>
                <button onClick={() => setShowUserForm(true)} className="btn-primary">+ Add User</button>
              </div>
              <div className="users-table">
                <table>
                  <thead>
                    <tr><th>Username</th><th>Role</th><th>Created</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.username}</td>
                        <td><span className={'role-badge ' + u.role}>{u.role}</span></td>
                        <td>{new Date(u.created_at).toLocaleDateString()}</td>
                        <td>{u.id !== user.id && <button onClick={() => handleDeleteUser(u.id)} className="btn-danger-action">Delete</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <h2>Platform Statistics</h2>
              <div className="user-stats">
                <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Users</div></div>
                <div className="stat-card"><div className="stat-icon">🔗</div><div className="stat-value">{stats.totalShortlinks}</div><div className="stat-label">Total Shortlinks</div></div>
                <div className="stat-card"><div className="stat-icon">👆</div><div className="stat-value">{stats.totalClicks}</div><div className="stat-label">Total Clicks</div></div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showUserForm && (
        <div className="modal-overlay" onClick={() => setShowUserForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Create New User</h3><button onClick={() => setShowUserForm(false)} className="modal-close">×</button></div>
            <form onSubmit={handleCreateUser}>
              <div className="form-group"><label>Username</label><input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required /></div>
              <div className="form-group"><label>Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
              <div className="form-group"><label>Role</label><select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}><option value="user">User</option><option value="admin">Admin</option></select></div>
              {userFormError && <div className="error-message">{userFormError}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowUserForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showShortlinkForm && <ShortlinkForm userId={user.id} onClose={() => setShowShortlinkForm(false)} onSuccess={() => { setShowShortlinkForm(false); loadData(); }} />}
      {editingShortlink && <ShortlinkForm userId={user.id} shortlink={editingShortlink} onClose={() => setEditingShortlink(null)} onSuccess={() => { setEditingShortlink(null); loadData(); }} />}
    </div>
  )
}
