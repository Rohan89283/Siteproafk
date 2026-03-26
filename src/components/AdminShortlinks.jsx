import { useState, useEffect } from 'react'
import { getShortlinks, updateShortlink, deleteShortlink } from '../lib/localStorage'
import './AdminShortlinks.css'

function AdminShortlinks() {
  const [shortlinks, setShortlinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadShortlinks()
  }, [])

  const loadShortlinks = () => {
    setLoading(true)
    const data = getShortlinks()
    setShortlinks(data || [])
    setLoading(false)
  }

  const handleToggleActive = (shortlink) => {
    const data = updateShortlink(shortlink.id, {
      is_active: !shortlink.is_active,
    })

    if (data) {
      setShortlinks(shortlinks.map(link => (link.id === shortlink.id ? data : link)))
    }
  }

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this shortlink?')) {
      return
    }

    const success = deleteShortlink(id)
    if (success) {
      setShortlinks(shortlinks.filter(link => link.id !== id))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const filteredShortlinks = shortlinks.filter(link =>
    link.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (link.title && link.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (link.shortlist_name && link.shortlist_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading shortlinks...</p>
      </div>
    )
  }

  const shortUrl = window.location.origin

  return (
    <div className="admin-shortlinks">
      <div className="shortlinks-header">
        <div>
          <h2>All Shortlinks</h2>
          <p>Manage all shortlinks across the platform</p>
        </div>
        <button onClick={loadShortlinks} className="btn btn-secondary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-bar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="input search-input"
          placeholder="Search by code, URL, title, or user email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="shortlinks-list-admin">
        {filteredShortlinks.length === 0 ? (
          <div className="empty-state">
            <p>{searchTerm ? 'No shortlinks found' : 'No shortlinks yet'}</p>
          </div>
        ) : (
          filteredShortlinks.map(link => (
            <div key={link.id} className={`admin-shortlink-card ${!link.is_active ? 'inactive' : ''}`}>
              <div className="card-main">
                <div className="card-left">
                  <div className="link-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="link-info">
                    {link.title && <h3 className="link-title">{link.title}</h3>}
                    <a
                      href={`${shortUrl}/r/${link.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-short"
                    >
                      {shortUrl}/r/{link.short_code}
                    </a>
                    <p className="link-original">{link.original_url}</p>
                    <div className="link-meta">
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8" />
                        </svg>
                        {link.users?.email || 'Unknown user'}
                      </span>
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {link.shortlists?.name || 'Unknown shortlist'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-right">
                  <div className="link-stats">
                    <div className="stat-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{link.clicks}</span>
                    </div>
                    <div className="stat-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span>{formatDate(link.created_at)}</span>
                    </div>
                  </div>
                  <div className="link-actions">
                    <button
                      onClick={() => handleToggleActive(link)}
                      className={`btn-icon ${link.is_active ? 'active' : 'inactive'}`}
                      title={link.is_active ? 'Disable' : 'Enable'}
                    >
                      {link.is_active ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="btn-icon btn-delete"
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {!link.is_active && (
                    <span className="badge badge-warning">Disabled</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="shortlinks-summary">
        <p>
          Showing {filteredShortlinks.length} of {shortlinks.length} shortlinks
        </p>
      </div>
    </div>
  )
}

export default AdminShortlinks
