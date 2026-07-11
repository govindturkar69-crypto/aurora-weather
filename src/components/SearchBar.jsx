import { useEffect, useRef, useState } from 'react'
import { searchLocations } from '../api/weather.js'

// Debounced location search with a live autocomplete dropdown, plus a
// "use my location" button that triggers the browser geolocation flow.
export default function SearchBar({ onSelect, onGeolocate, geoLoading }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(-1)
  const boxRef = useRef(null)

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const r = await searchLocations(q)
        setResults(r); setOpen(true); setActive(-1)
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 250)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const choose = (place) => {
    onSelect(place)
    setQ('')
    setResults([])
    setOpen(false)
  }

  const onKey = (e) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[active >= 0 ? active : 0]) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="search" ref={boxRef}>
      <div className="search-input-wrap">
        <SearchGlyph />
        <input
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search city, town or place…"
          spellCheck={false}
          aria-label="Search location"
        />
        {loading && <span className="search-spin" />}
        <button
          className="geo-btn"
          onClick={onGeolocate}
          title="Use my location"
          aria-label="Use my location"
          disabled={geoLoading}
        >
          {geoLoading ? <span className="search-spin" /> : <PinGlyph />}
        </button>
      </div>

      {open && results.length > 0 && (
        <ul className="search-results">
          {results.map((r, i) => (
            <li
              key={r.id}
              className={i === active ? 'active' : ''}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); choose(r) }}
            >
              <span className="res-name">{r.name}</span>
              <span className="res-meta">
                {[r.admin, r.country].filter(Boolean).join(', ')}
              </span>
              {r.countryCode && <span className="res-flag">{flagEmoji(r.countryCode)}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function flagEmoji(cc) {
  if (!cc || cc.length !== 2) return ''
  return String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}

function SearchGlyph() {
  return (
    <svg className="search-glyph" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PinGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" />
    </svg>
  )
}
