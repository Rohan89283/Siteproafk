import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getShortlinks, createShortlink, getShortlists } from '../lib/shortlinks'
import ShortlinkItem from './ShortlinkItem'
import './ShortlinksView.css'

function ShortlinksView({ userId }) {
  const { shortlistId } = useParams()
  const navigate = useNavigate()
  const [shortlist, setShortlist] = useState(null)
  const [shortlinks, setShortlinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    originalUrl: '',
    shortCode: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [shortlistId])

  const loadData = async () => {
    setLoading(true)
    setError('')

    // Load shortlist details
    const { data: shortlistsData } = await getShortlists(userId)
    const currentShortlist = shortlistsData?.find(s => s.id === shortlistId)

    if (!currentShortlist) {
      navigate('/dashboard')
      return
    }

    setShortlist(currentShortlist)

    // Load shortlinks
    const { data, error } = await getShortlinks(shortlistId)
    if (error) {
      setError(error.message)
    } else {
      setShortlinks(data || [])
    }
    setLoading(false)
  }

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8).toLowerCase()
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.originalUrl.trim() || !formData.shortCode.trim()) {
      setError('URL and short code are required')
      return
    }

    // Validate URL
    try {
      new URL(formData.originalUrl)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    // Validate short code (alphanumeric only)
    if (!/^[a-z0-9]+$/i.test(formData.shortCode)) {
      setError('Short code can only contain letters and numbers')
      return
    }

    const { data, error } = await createShortlink(
      shortlistId,
      userId,
      formData.originalUrl,
      formData.shortCode,
      formData.title
    )

    if (error) {
      setError(error.message)
    } else {
      setShortlinks([data, ...shortlinks])
      setShowModal(false)
      setFormData({ title: '', originalUrl: '', shortCode: '' })
    }
  }

  const handleDelete = (id) => {
    setShortlinks(shortlinks.filter(link => link.id !== id))
  }

  const handleUpdate = (updatedLink) => {
    setShortlinks(shortlinks.map(link =>
      link.id === updatedLink.id ? updatedLink : link
    ))
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading links...</p>
      </div>
    )
  }

  const shortUrl = window.location.origin

  return (
    <div className="shortlinks-view">
      <div className="view-header">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-secondary back-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Shortlists
        </button>
      </div>

      <div className="shortlist-header">
        <div>
          <h1>{shortlist?.name}</h1>
          {shortlist?.description && <p>{shortlist.description}</p>}
        </div>
        <button
          onClick={() => {
            setFormData({ ...formData, shortCode: generateShortCode() })
            setShowModal(true)
          }}
          className="btn btn-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Link
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {shortlinks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h2>No Links Yet</h2>
          <p>Add your first short link to get started</p>
          <button
            onClick={() => {
              setFormData({ ...formData, shortCode: generateShortCode() })
              setShowModal(true)
            }}
            className="btn btn-primary"
          >
            Add Link
          </button>
        </div>
      ) : (
        <div className="shortlinks-list">
          {shortlinks.map(link => (
            <ShortlinkItem
              key={link.id}
              shortlink={link}
              shortUrl={shortUrl}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Link</h2>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="title">Title (optional)</label>
                <input
                  id="title"
                  type="text"
                  className="input"
                  placeholder="My Awesome Link"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="originalUrl">Original URL</label>
                <input
                  id="originalUrl"
                  type="url"
                  className="input"
                  placeholder="https://example.com/very/long/url"
                  value={formData.originalUrl}
                  onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="shortCode">Short Code</label>
                <div className="input-group">
                  <span className="input-prefix">{shortUrl}/r/</span>
                  <input
                    id="shortCode"
                    type="text"
                    className="input input-with-prefix"
                    placeholder="abc123"
                    value={formData.shortCode}
                    onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                    required
                    pattern="[a-zA-Z0-9]+"
                    title="Only letters and numbers allowed"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setFormData({ ...formData, shortCode: generateShortCode() })}
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShortlinksView
