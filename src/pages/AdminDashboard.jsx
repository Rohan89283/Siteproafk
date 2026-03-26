import { useState } from 'react'
import { logout } from '../lib/localStorage'
import { configureTelegram, sendBackupToTelegram, getTelegramConfig } from '../lib/telegram'
import AdminStats from '../components/AdminStats'
import AdminUsers from '../components/AdminUsers'
import AdminShortlinks from '../components/AdminShortlinks'
import './AdminDashboard.css'

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('stats')
  const [showTelegramSetup, setShowTelegramSetup] = useState(false)
  const [botToken, setBotToken] = useState('')
  const [chatId, setChatId] = useState('')
  const [backupMessage, setBackupMessage] = useState('')

  const handleSignOut = () => {
    logout()
    onLogout()
  }

  const handleTelegramClick = () => {
    const config = getTelegramConfig()
    if (config) {
      setBotToken(config.botToken)
      setChatId(config.chatId)
    }
    setShowTelegramSetup(true)
  }

  const saveTelegramConfig = () => {
    if (!botToken || !chatId) {
      setBackupMessage('Error: Please fill in both fields')
      setTimeout(() => setBackupMessage(''), 3000)
      return
    }
    configureTelegram(botToken, chatId)
    setShowTelegramSetup(false)
    setBackupMessage('Telegram configured successfully!')
    setTimeout(() => setBackupMessage(''), 3000)
  }

  const handleBackup = async () => {
    try {
      await sendBackupToTelegram()
      setBackupMessage('Backup sent to Telegram successfully!')
    } catch (error) {
      setBackupMessage(`Error: ${error.message}`)
    }
    setTimeout(() => setBackupMessage(''), 5000)
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="nav-brand">
          <div className="nav-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className="brand-name">Admin Panel</span>
            <span className="brand-subtitle">ShortLink Manager</span>
          </div>
        </div>

        <div className="nav-user">
          <button onClick={handleTelegramClick} className="btn btn-secondary" title="Configure Telegram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
          <button onClick={handleBackup} className="btn btn-secondary" title="Backup to Telegram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </button>
          <div className="user-info">
            <div className="user-avatar admin">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-email">{user.username}</span>
              <span className="user-role badge badge-warning">Admin</span>
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

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Statistics
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users
        </button>
        <button
          className={`admin-tab ${activeTab === 'shortlinks' ? 'active' : ''}`}
          onClick={() => setActiveTab('shortlinks')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          All Shortlinks
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'shortlinks' && <AdminShortlinks />}
      </div>
    </div>
  )
}

export default AdminDashboard
