import { useState, useEffect } from 'react'
import { getShortlinks } from '../lib/shortlinks'
import { supabase } from '../lib/supabase'
import './UserStats.css'

function UserStats() {
  const [stats, setStats] = useState({
    totalShortlinks: 0,
    totalClicks: 0,
    activeLinks: 0,
    clicksByPlatform: {},
    clicksByDevice: {},
    clicksByBrowser: {},
    recentClicks: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    setError('')

    try {
      const { data: shortlinks, error: linksError } = await getShortlinks()
      if (linksError) throw linksError

      const totalShortlinks = shortlinks?.length || 0
      const activeLinks = shortlinks?.filter(link => link.is_active).length || 0
      const totalClicks = shortlinks?.reduce((sum, link) => sum + (link.click_count || 0), 0) || 0

      const shortlinkIds = shortlinks?.map(link => link.id) || []

      let clicksByPlatform = {}
      let clicksByDevice = {}
      let clicksByBrowser = {}
      let recentClicks = []

      if (shortlinkIds.length > 0) {
        const { data: analytics, error: analyticsError } = await supabase
          .from('click_analytics')
          .select('*')
          .in('shortlink_id', shortlinkIds)
          .order('clicked_at', { ascending: false })

        if (!analyticsError && analytics) {
          clicksByPlatform = analytics.reduce((acc, click) => {
            const platform = click.platform || 'Unknown'
            acc[platform] = (acc[platform] || 0) + 1
            return acc
          }, {})

          clicksByDevice = analytics.reduce((acc, click) => {
            const device = click.device || 'Unknown'
            acc[device] = (acc[device] || 0) + 1
            return acc
          }, {})

          clicksByBrowser = analytics.reduce((acc, click) => {
            const browser = click.browser || 'Unknown'
            acc[browser] = (acc[browser] || 0) + 1
            return acc
          }, {})

          recentClicks = analytics.slice(0, 10).map(click => {
            const shortlink = shortlinks.find(link => link.id === click.shortlink_id)
            return {
              ...click,
              shortCode: shortlink?.short_code || 'Unknown'
            }
          })
        }
      }

      setStats({
        totalShortlinks,
        totalClicks,
        activeLinks,
        clicksByPlatform,
        clicksByDevice,
        clicksByBrowser,
        recentClicks
      })
    } catch (err) {
      setError(err.message || 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading statistics...</p>
      </div>
    )
  }

  return (
    <div className="user-stats">
      <div className="stats-header">
        <div>
          <h2>My Statistics</h2>
          <p>Track your shortlink performance</p>
        </div>
        <button onClick={loadStats} className="btn btn-secondary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Shortlinks</p>
            <p className="stat-value">{stats.totalShortlinks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Links</p>
            <p className="stat-value">{stats.activeLinks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Clicks</p>
            <p className="stat-value">{stats.totalClicks}</p>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Clicks by Platform</h3>
          <div className="analytics-list">
            {Object.keys(stats.clicksByPlatform).length > 0 ? (
              Object.entries(stats.clicksByPlatform).map(([platform, count]) => (
                <div key={platform} className="analytics-item">
                  <span className="analytics-label">{platform}</span>
                  <span className="analytics-value">{count}</span>
                </div>
              ))
            ) : (
              <p className="empty-text">No data yet</p>
            )}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Clicks by Device</h3>
          <div className="analytics-list">
            {Object.keys(stats.clicksByDevice).length > 0 ? (
              Object.entries(stats.clicksByDevice).map(([device, count]) => (
                <div key={device} className="analytics-item">
                  <span className="analytics-label">{device}</span>
                  <span className="analytics-value">{count}</span>
                </div>
              ))
            ) : (
              <p className="empty-text">No data yet</p>
            )}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Clicks by Browser</h3>
          <div className="analytics-list">
            {Object.keys(stats.clicksByBrowser).length > 0 ? (
              Object.entries(stats.clicksByBrowser).map(([browser, count]) => (
                <div key={browser} className="analytics-item">
                  <span className="analytics-label">{browser}</span>
                  <span className="analytics-value">{count}</span>
                </div>
              ))
            ) : (
              <p className="empty-text">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {stats.recentClicks.length > 0 && (
        <div className="recent-clicks-card">
          <h3>Recent Clicks</h3>
          <div className="recent-clicks-list">
            {stats.recentClicks.map((click, index) => (
              <div key={index} className="recent-click-item">
                <div className="click-info">
                  <span className="click-code">/{click.shortCode}</span>
                  <span className="click-details">
                    {click.platform} {click.device && `• ${click.device}`} {click.browser && `• ${click.browser}`}
                  </span>
                </div>
                <span className="click-time">{formatDate(click.clicked_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserStats
