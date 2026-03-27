import { useState } from 'react'
import { createShortlink, updateShortlink } from '../lib/shortlinks'
import './ShortlinkForm.css'

export default function ShortlinkForm({ userId, shortlink = null, onClose, onSuccess }) {
  const [destinationUrl, setDestinationUrl] = useState(shortlink?.destination_url || '')
  const [customCode, setCustomCode] = useState(shortlink?.short_code || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEditing = !!shortlink

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isEditing) {
        await updateShortlink(shortlink.id, { destination_url: destinationUrl })
      } else {
        await createShortlink(destinationUrl, customCode || null, userId)
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Shortlink' : 'Create Shortlink'}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="destination">Destination URL</label>
            <input
              id="destination"
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
            <small>The URL where users will be redirected</small>
          </div>

          {!isEditing && (
            <div className="form-group">
              <label htmlFor="custom">Custom Short Code (Optional)</label>
              <input
                id="custom"
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="my-link"
                pattern="[a-zA-Z0-9-_]+"
              />
              <small>Leave empty to auto-generate. Only letters, numbers, hyphens, and underscores.</small>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
