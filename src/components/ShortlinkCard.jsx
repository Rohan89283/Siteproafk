import { supabase } from '../lib/supabase'
import { deleteShortlink, toggleShortlinkStatus } from '../lib/shortlinks'

export default function ShortlinkCard({ shortlink, onEdit, onReload }) {
  async function handleDelete() {
    if (!confirm('Delete this shortlink?')) return
    try {
      await deleteShortlink(shortlink.id)
      onReload()
    } catch (error) {
      alert('Failed to delete: ' + error.message)
    }
  }

  async function handleToggle() {
    try {
      await toggleShortlinkStatus(shortlink.id, !shortlink.is_active)
      onReload()
    } catch (error) {
      alert('Failed to toggle: ' + error.message)
    }
  }

  function handleCopy() {
    const url = `${window.location.origin}/r/${shortlink.short_code}`
    navigator.clipboard.writeText(url)
    alert('Shortlink copied!')
  }

  return (
    <div className="shortlink-card">
      <div className="shortlink-header">
        <div className="shortlink-code">/{shortlink.short_code}</div>
        <span className={`status-badge ${shortlink.is_active ? 'active' : 'inactive'}`}>
          {shortlink.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="shortlink-url">{shortlink.original_url}</div>
      <div className="shortlink-meta">
        <span className="meta-item">👆 {shortlink.click_count} clicks</span>
        <span className="meta-item">📅 {new Date(shortlink.created_at).toLocaleDateString()}</span>
      </div>
      <div className="shortlink-actions">
        <button onClick={handleCopy} className="btn-action">Copy</button>
        <button onClick={() => onEdit(shortlink)} className="btn-action">Edit</button>
        <button onClick={handleToggle} className="btn-action">
          {shortlink.is_active ? 'Deactivate' : 'Activate'}
        </button>
        <button onClick={handleDelete} className="btn-danger-action">Delete</button>
      </div>
    </div>
  )
}
