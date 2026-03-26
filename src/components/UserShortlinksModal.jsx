import { useState, useEffect } from 'react'
import { getShortlinksByUser } from '../lib/shortlinks'
import './UserShortlinksModal.css'

function UserShortlinksModal({ user, onClose }) {
  const [shortlinks, setShortlinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUserShortlinks()
  }, [user.id])

  const loadUserShortlinks = async () => {
    setLoading(true)
    const { data, error: loadError } = await getShortlinksByUser(user.id)
    if (loadError) {
      setError(loadError.message || 'Failed to load shortlinks')
    } else {
      setShortlinks(data || [])
    }
    setLoading(false)
  }

  const shortUrl = window.location.origin

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-shortlinks-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{user.username}'s Shortlinks</h2>
            <p>View all shortlinks created by this user</p>
          </div>
          <button onClick={onClose} className="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading shortlinks...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : shortlinks.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h3>No Shortlinks</h3>
              <p>This user hasn't created any shortlinks yet</p>
            </div>
          ) : (
            <div className="shortlinks-grid">
              {shortlinks.map(link => (
                <div key={link.id} className={`shortlink-card ${!link.is_active ? 'inactive' : ''}`}>
                  <div className="card-header">
                    <div className="link-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="link-details">
                      <a
                        href={`${shortUrl}/r/${link.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-short"
                      >
                        {shortUrl}/r/{link.short_code}
                      </a>
                      <a
                        href={link.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-destination"
                      >
                        {link.original_url}
                      </a>
                    </div>
                  </div>

                  <div className="card-stats">
                    <div className="stat">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{link.click_count || 0} clicks</span>
                    </div>
                    <div className="stat">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{link.redirect_type === 'direct' ? 'Direct' : 'Redirect'}</span>
                    </div>
                    {!link.is_active && (
                      <span className="badge badge-warning">Disabled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="modal-footer">
            <p>Total: {shortlinks.length} shortlinks</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserShortlinksModal
