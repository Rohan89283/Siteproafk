import { useState, useEffect } from 'react'
import { getShortlinks, createShortlink, deleteShortlink, toggleShortlink } from '../lib/shortlinks'
import ShortlinkItem from './ShortlinkItem'
import './UserShortlinks.css'

function UserShortlinks() {
  const [shortlinks, setShortlinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ url: '', customSlug: '', redirectType: 'redirect' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleCreate = async (e) => {
    e.preventDefault()

    if (!formData.url.trim()) {
      setError('Please enter a URL')
      return
    }

    try {
      new URL(formData.url)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    if (formData.customSlug && !/^[a-zA-Z0-9-_]+$/.test(formData.customSlug)) {
      setError('Custom slug can only contain letters, numbers, hyphens, and underscores')
      return
    }

    setCreating(true)
    setError('')

    const { data, error: createError } = await createShortlink(
      formData.url,
      formData.customSlug || null,
      null,
      formData.redirectType
    )

    if (createError) {
      setError(createError.message || 'Failed to create shortlink')
      setCreating(false)
    } else {
      setShortlinks([data, ...shortlinks])
      setShowModal(false)
      setFormData({ url: '', customSlug: '', redirectType: 'redirect' })
      setCreating(false)
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

  const handleToggle = async (id, isActive) => {
    const { error: toggleError } = await toggleShortlink(id, !isActive)
    if (toggleError) {
      setError(toggleError.message || 'Failed to update shortlink')
    } else {
      setShortlinks(shortlinks.map(link =>
        link.id === id ? { ...link, is_active: !isActive } : link
      ))
    }
  }

  const filteredShortlinks = shortlinks.filter(link =>
    link.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.original_url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const shortUrl = window.location.origin

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading shortlinks...</p>
      </div>
    )
  }

  return (
    <div className="user-shortlinks">
      <div className="shortlinks-header">
        <div>
          <h1>My Shortlinks</h1>
          <p>Create and manage your redirect links</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Shortlink
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {shortlinks.length > 0 && (
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by code or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>
      )}

      {filteredShortlinks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h2>{searchTerm ? 'No Results Found' : 'No Shortlinks Yet'}</h2>
          <p>{searchTerm ? 'Try a different search term' : 'Create your first shortlink to get started'}</p>
          {!searchTerm && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              Create Shortlink
            </button>
          )}
        </div>
      ) : (
        <div className="shortlinks-list">
          {filteredShortlinks.map(link => (
            <ShortlinkItem
              key={link.id}
              shortlink={link}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      <div className="shortlinks-count">
        Showing {filteredShortlinks.length} of {shortlinks.length} shortlinks
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Shortlink</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="url">Destination URL *</label>
                <input
                  id="url"
                  type="url"
                  className="input"
                  placeholder="https://example.com/your/long/url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="customSlug">Custom Slug (Optional)</label>
                <div className="input-preview">
                  <span className="input-preview-prefix">{shortUrl}/r/</span>
                  <input
                    id="customSlug"
                    type="text"
                    className="input"
                    placeholder="my-custom-link"
                    value={formData.customSlug}
                    onChange={(e) => setFormData({ ...formData, customSlug: e.target.value })}
                    pattern="[a-zA-Z0-9-_]+"
                    title="Only letters, numbers, hyphens, and underscores allowed"
                  />
                </div>
                <small>Leave empty to generate a random code</small>
              </div>

              <div className="form-group">
                <label>Redirect Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="redirectType"
                      value="redirect"
                      checked={formData.redirectType === 'redirect'}
                      onChange={(e) => setFormData({ ...formData, redirectType: e.target.value })}
                    />
                    <span>Redirect with Loading Page</span>
                    <small>Shows a loading page before redirecting</small>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="redirectType"
                      value="direct"
                      checked={formData.redirectType === 'direct'}
                      onChange={(e) => setFormData({ ...formData, redirectType: e.target.value })}
                    />
                    <span>Direct Redirect</span>
                    <small>Instantly redirects to destination</small>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? (
                    <>
                      <div className="btn-spinner"></div>
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserShortlinks
