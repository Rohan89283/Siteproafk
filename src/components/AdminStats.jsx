import { useState, useEffect } from 'react'
import { getStats } from '../lib/shortlinks'
import './AdminStats.css'

function AdminStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    const { data, error } = await getStats()
    if (error) {
      setError(error.message)
    } else {
      setStats(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading statistics...</p>
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: 'var(--gradient-primary)',
      color: '#6366f1',
    },
    {
      title: 'Total Shortlists',
      value: stats.totalShortlists,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'var(--gradient-secondary)',
      color: '#8b5cf6',
    },
    {
      title: 'Total Shortlinks',
      value: stats.totalShortlinks,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      gradient: 'var(--gradient-accent)',
      color: '#4facfe',
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb',
    },
  ]

  return (
    <div className="admin-stats">
      <div className="stats-header">
        <h2>Platform Statistics</h2>
        <button onClick={loadStats} className="btn btn-secondary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div
              className="stat-icon"
              style={{ background: card.gradient }}
            >
              {card.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-title">{card.title}</h3>
              <p className="stat-value" style={{ color: card.color }}>
                {card.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-insights">
        <div className="insight-card">
          <h3>Quick Insights</h3>
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-label">Average links per shortlist:</span>
              <span className="insight-value">
                {stats.totalShortlists > 0
                  ? (stats.totalShortlinks / stats.totalShortlists).toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Average clicks per link:</span>
              <span className="insight-value">
                {stats.totalShortlinks > 0
                  ? (stats.totalClicks / stats.totalShortlinks).toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Average shortlists per user:</span>
              <span className="insight-value">
                {stats.totalUsers > 0
                  ? (stats.totalShortlists / stats.totalUsers).toFixed(2)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStats
