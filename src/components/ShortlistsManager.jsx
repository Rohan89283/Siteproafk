import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getShortlists, createShortlist, deleteShortlist } from '../lib/shortlinks'
import ShortlistCard from './ShortlistCard'
import './ShortlistsManager.css'

function ShortlistsManager() {
  const [shortlists, setShortlists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadShortlists()
  }, [])

  const loadShortlists = async () => {
    setLoading(true)
    setError('')
    const { data, error: listsError } = await getShortlists()
    if (listsError) {
      setError(listsError.message || 'Failed to load shortlists')
    } else {
      setShortlists(data || [])
    }
    setLoading(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    const { data, error: createError } = await createShortlist(formData.name)
    if (createError) {
      setError(createError.message || 'Failed to create shortlist')
    } else {
      setShortlists([data, ...shortlists])
      setShowModal(false)
      setFormData({ name: '' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this shortlist? All associated links will be deleted.')) {
      return
    }

    const { error: deleteError } = await deleteShortlist(id)
    if (deleteError) {
      setError(deleteError.message || 'Failed to delete shortlist')
    } else {
      setShortlists(shortlists.filter(list => list.id !== id))
    }
  }

  const handleView = (id) => {
    navigate(`/dashboard/shortlist/${id}`)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading shortlists...</p>
      </div>
    )
  }

  return (
    <div className="shortlists-manager">
      <div className="manager-header">
        <div>
          <h1>My Shortlists</h1>
          <p>Organize your links into collections</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Shortlist
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {shortlists.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2>No Shortlists Yet</h2>
          <p>Create your first shortlist to start organizing your links</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Create Shortlist
          </button>
        </div>
      ) : (
        <div className="shortlists-grid">
          {shortlists.map(shortlist => (
            <ShortlistCard
              key={shortlist.id}
              shortlist={shortlist}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Shortlist</h2>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  placeholder="My Links"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShortlistsManager
