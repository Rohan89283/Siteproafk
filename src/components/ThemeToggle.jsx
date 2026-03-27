import { useState, useEffect } from 'react'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} className="theme-toggle">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
