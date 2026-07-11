import { round } from '../utils/format.js'

export default function Pollen({ pollen }) {
  if (!pollen) {
    return (
      <section className="card pollen">
        <header className="card-head"><h2>Pollen</h2></header>
        <p className="pollen-empty">
          Live pollen isn’t published for this region yet — coverage is currently
          most complete across Europe. It will appear here automatically when you
          view a supported location.
        </p>
      </section>
    )
  }

  const items = [
    { key: 'grass', label: 'Grass' },
    { key: 'birch', label: 'Birch' },
    { key: 'alder', label: 'Alder' },
    { key: 'ragweed', label: 'Ragweed' },
    { key: 'mugwort', label: 'Mugwort' },
    { key: 'olive', label: 'Olive' },
  ].filter((it) => pollen[it.key] != null)

  return (
    <section className="card pollen">
      <header className="card-head"><h2>Pollen</h2></header>
      <div className="pollen-grid">
        {items.map((it) => {
          const v = pollen[it.key]
          const cat = pollenCategory(it.key, v)
          return (
            <div className="pollen-item" key={it.key}>
              <div className="pollen-top">
                <span className="pollen-label">{it.label}</span>
                <span className="pollen-cat" style={{ color: cat.color }}>{cat.label}</span>
              </div>
              <div className="pollen-bar"><span style={{ width: `${cat.pct}%`, background: cat.color }} /></div>
              <span className="pollen-val">{round(v, 1)} <em>grains/m³</em></span>
            </div>
          )
        })}
      </div>
      <p className="pollen-note">Concentration in grains per cubic metre.</p>
    </section>
  )
}

function pollenCategory(kind, v) {
  const T = {
    grass:   [1, 5, 20, 200],
    birch:   [1, 10, 50, 500],
    alder:   [1, 10, 50, 500],
    ragweed: [1, 5, 20, 100],
    mugwort: [1, 5, 20, 100],
    olive:   [1, 20, 100, 400],
  }[kind] || [1, 10, 50, 500]

  const cap = T[3]
  const pct = Math.min((v / cap) * 100, 100)
  if (v < T[0]) return { label: 'None', color: '#4ade80', pct }
  if (v < T[1]) return { label: 'Low', color: '#4ade80', pct }
  if (v < T[2]) return { label: 'Moderate', color: '#facc15', pct }
  if (v < T[3]) return { label: 'High', color: '#fb923c', pct }
  return { label: 'Very High', color: '#f87171', pct }
}
