export default function SavedLocations({ places, activeId, onSelect, onRemove }) {
  if (!places.length) return null
  return (
    <div className="saved">
      {places.map((p) => (
        <div key={p.id} className={`chip ${p.id === activeId ? 'active' : ''}`}>
          <button className="chip-main" onClick={() => onSelect(p)}>
            <PinDot />
            <span>{p.name}</span>
            {p.countryCode && <span className="chip-cc">{p.countryCode}</span>}
          </button>
          <button className="chip-x" onClick={() => onRemove(p.id)} aria-label={`Remove ${p.name}`}>✕</button>
        </div>
      ))}
    </div>
  )
}

const PinDot = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="9" r="2.4" fill="currentColor" />
  </svg>
)
