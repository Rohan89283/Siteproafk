import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getShortlinkByCode, incrementClicks } from '../lib/shortlinks'
import './Redirect.css'

function Redirect() {
  const { shortCode } = useParams()
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const { data, error } = await getShortlinkByCode(shortCode)

        if (error || !data) {
          setStatus('error')
          setError('Short link not found')
          return
        }

        if (!data.is_active) {
          setStatus('error')
          setError('This link has been disabled')
          return
        }

        // Increment click count
        await incrementClicks(data.id)

        // Check redirect type
        if (data.redirect_type === 'direct') {
          // Direct redirect - instant
          window.location.href = data.original_url
        } else {
          // Redirect with loading page
          setStatus('redirecting')
          setTimeout(() => {
            window.location.href = data.original_url
          }, 1000)
        }
      } catch (err) {
        setStatus('error')
        setError('An error occurred')
        console.error('Redirect error:', err)
      }
    }

    if (shortCode) {
      handleRedirect()
    } else {
      setStatus('error')
      setError('Invalid short code')
    }
  }, [shortCode])

  return (
    <div className="redirect-container">
      <div className="redirect-card">
        {status === 'loading' && (
          <>
            <div className="redirect-icon loading">
              <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h1>Loading...</h1>
            <p>Please wait while we find your link</p>
          </>
        )}

        {status === 'redirecting' && (
          <>
            <div className="redirect-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h1>Redirecting...</h1>
            <p>Taking you to your destination</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="redirect-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1>Oops!</h1>
            <p>{error}</p>
            <a href="/" className="btn btn-primary">
              Go to Home
            </a>
          </>
        )}
      </div>

      <div className="redirect-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>
    </div>
  )
}

export default Redirect
