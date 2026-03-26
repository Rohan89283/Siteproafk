import { useState, useEffect } from 'react'
import { getShortlinks, createShortlink, toggleShortlink, deleteShortlink } from '../lib/shortlinks'
import './AdminShortlinks.css'

function AdminShortlinks() {
  const [shortlinks, setShortlinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newLink, setNewLink] = useState({ url: '', customSlug: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadShortlinks()
  }, [])

  const loadShortlinks = async () => {
    setLoading(true)
    setError('')
    const { data, error: linksError } = await getShortlinks()
    if (linksError) {
      setError(linksError.message || 'Failed to load shortlinks')
    } else {
      setShortlinks(data || [])
    }
    setLoading(false)
  }

  const handleToggleActive = async (shortlink) => {
    const { data, error: toggleError } = await toggleShortlink(shortlink.id, !shortlink.is_active)

    if (toggleError) {
      setError(toggleError.message || 'Failed to toggle shortlink')
    } else if (data) {
      setShortlinks(shortlinks.map(link => (link.id === shortlink.id ? data : link)))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this shortlink?')) {
      return
    }

    const { error: deleteError } = await deleteShortlink(id)
    if (deleteError) {
      setError(deleteError.message || 'Failed to delete shortlink')
    } else {
      setShortlinks(shortlinks.filter(link => link.id !== id))
    }
  }

  const handleCreateShortlink = async (e) => {
    e.preventDefault()
    if (!newLink.url.trim()) {
      setError('Please enter a URL')
      return
    }

    setCreating(true)
    setError('')
    const { data, error: createError } = await createShortlink(newLink.url, newLink.customSlug || null)

    if (createError) {
      setError(createError.message || 'Failed to create shortlink')
      setCreating(false)
    } else {
      setShortlinks([data, ...shortlinks])
      setShowCreateModal(false)
      setNewLink({ url: '', customSlug: '' })
      setCreating(false)
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
    link.original_url.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Create Shortlink
          </button>
          <button onClick={loadShortlinks} className="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
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
          placeholder="Search by code or URL..."
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
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {link.click_count || 0} clicks
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-right">
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

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Shortlink</h3>
              <button onClick={() => setShowCreateModal(false)} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateShortlink} className="modal-form">
              <div className="form-group">
                <label htmlFor="url">Destination URL *</label>
                <input
                  id="url"
                  type="url"
                  className="input"
                  placeholder="https://example.com"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="customSlug">Custom Slug (Optional)</label>
                <input
                  id="customSlug"
                  type="text"
                  className="input"
                  placeholder="my-custom-link"
                  value={newLink.customSlug}
                  onChange={(e) => setNewLink({ ...newLink, customSlug: e.target.value })}
                  pattern="[a-zA-Z0-9-_]+"
                  title="Only letters, numbers, hyphens, and underscores allowed"
                />
                <small>Leave empty to generate a random code</small>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Shortlink'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminShortlinks
