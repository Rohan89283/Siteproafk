import { useState } from 'react'
import { updateShortlink, deleteShortlink, toggleShortlink } from '../lib/shortlinks'
import './ShortlinkItem.css'

function ShortlinkItem({ shortlink, shortUrl, onDelete, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState({
    originalUrl: shortlink.original_url,
    redirectType: shortlink.redirect_type || 'redirect',
  })
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const fullShortUrl = `${shortUrl}/r/${shortlink.short_code}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')

    try {
      new URL(editData.originalUrl)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    const { data, error: updateError } = await updateShortlink(shortlink.id, {
      original_url: editData.originalUrl,
      redirect_type: editData.redirectType,
    })

    if (updateError) {
      setError(updateError.message || 'Failed to update shortlink')
    } else {
      onUpdate(data)
      setShowEdit(false)
    }
  }

  const handleToggleActive = async () => {
    const { data, error: toggleError } = await toggleShortlink(shortlink.id, !shortlink.is_active)

    if (!toggleError && data) {
      onUpdate(data)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return
    }

    const { error: deleteError } = await deleteShortlink(shortlink.id)
    if (!deleteError) {
      onDelete(shortlink.id)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className={`shortlink-item ${!shortlink.is_active ? 'inactive' : ''}`}>
      <div className="item-main">
        <div className="item-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>

        <div className="item-content">
          <div className="item-header">
            <div>
              <a
                href={fullShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="item-short-url"
              >
                {fullShortUrl}
              </a>
            </div>
            <div className="item-actions">
              <button
                onClick={handleCopy}
                className="btn-icon"
                title="Copy link"
              >
                {copied ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowEdit(!showEdit)}
                className="btn-icon"
                title="Edit"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                onClick={handleToggleActive}
                className={`btn-icon ${shortlink.is_active ? '' : 'inactive'}`}
                title={shortlink.is_active ? 'Disable' : 'Enable'}
              >
                {shortlink.is_active ? (
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
                onClick={handleDelete}
                className="btn-icon btn-delete"
                title="Delete"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="item-details">
            <a
              href={shortlink.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="item-original-url"
            >
              {shortlink.original_url}
            </a>
          </div>

          <div className="item-footer">
            <div className="item-stats">
              <span className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {shortlink.click_count || 0} clicks
              </span>
              <span className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Created {formatDate(shortlink.created_at)}
              </span>
              {!shortlink.is_active && (
                <span className="badge badge-warning">Disabled</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="item-edit">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Destination URL</label>
              <input
                type="url"
                className="input"
                value={editData.originalUrl}
                onChange={(e) => setEditData({ ...editData, originalUrl: e.target.value })}
                required
              />
              <small>You can change the destination URL</small>
            </div>
            <div className="form-group">
              <label>Redirect Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="redirectType"
                    value="instant"
                    checked={editData.redirectType === 'instant'}
                    onChange={(e) => setEditData({ ...editData, redirectType: e.target.value })}
                  />
                  <span>Instant Redirect</span>
                  <small>Fastest redirect, no tracking delay</small>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="redirectType"
                    value="direct"
                    checked={editData.redirectType === 'direct'}
                    onChange={(e) => setEditData({ ...editData, redirectType: e.target.value })}
                  />
                  <span>Direct Redirect</span>
                  <small>Quick redirect after tracking</small>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="redirectType"
                    value="redirect"
                    checked={editData.redirectType === 'redirect'}
                    onChange={(e) => setEditData({ ...editData, redirectType: e.target.value })}
                  />
                  <span>Redirect with Loading Page</span>
                  <small>Shows loading animation</small>
                </label>
              </div>
            </div>
            <div className="info-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>The short URL cannot be changed after creation</span>
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ShortlinkItem
