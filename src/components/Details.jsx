import { convDistance, convSpeed, round, units, windDirection } from '../utils/format.js'
import { uvCategory } from '../utils/weatherCodes.js'

export default function Details({ data, system }) {
  const c = data.current
  const u = units(system)
  const uv = uvCategory(c.uv)

  return (
    <section className="card details">
      <header className="card-head"><h2>Conditions</h2></header>
      <div className="detail-grid">
        <Tile label="Humidity" value={round(c.humidity)} unit="%" icon={<Humidity />}
          extra={<Bar pct={c.humidity} color="#5aa9ff" />} />

        <Tile label="Wind" value={round(convSpeed(c.wind, system))} unit={u.speed} icon={<Compass deg={c.windDir} />}
          extra={<span className="tile-note">{windDirection(c.windDir)} • gust {round(convSpeed(c.gust, system))} {u.speed}</span>} />

        <Tile label="UV Index" value={round(c.uv, 1)} unit="" icon={<UvGlyph />}
          extra={<><span className="tile-note" style={{ color: uv.color }}>{uv.label}</span><Bar pct={Math.min((c.uv / 11) * 100, 100)} color={uv.color} /></>} />

        <Tile label="Pressure" value={round(c.pressure)} unit={u.press} icon={<Gauge />}
          extra={<span className="tile-note">{c.pressure > 1013 ? 'High' : 'Low'} pressure</span>} />

        <Tile label="Visibility" value={round(convDistance(c.visibility, system), 1)} unit={u.dist} icon={<Eye />}
          extra={<span className="tile-note">{c.visibility >= 10000 ? 'Clear' : c.visibility >= 4000 ? 'Moderate' : 'Poor'}</span>} />

        <Tile label="Cloud cover" value={round(c.cloud)} unit="%" icon={<CloudGlyph />}
          extra={<Bar pct={c.cloud} color="#a9b6cf" />} />
      </div>
    </section>
  )
}

function Tile({ label, value, unit, icon, extra }) {
  return (
    <div className="detail-tile">
      <div className="tile-top"><span className="tile-icon">{icon}</span><span className="tile-label">{label}</span></div>
      <div className="tile-value">{value}<span className="tile-unit">{unit}</span></div>
      <div className="tile-extra">{extra}</div>
    </div>
  )
}

const Bar = ({ pct, color }) => (
  <span className="mini-bar"><span style={{ width: `${Math.max(0, Math.min(100, pct || 0))}%`, background: color }} /></span>
)

function Compass({ deg = 0 }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" opacity=".4" />
      <g transform={`rotate(${deg || 0} 12 12)`} className="compass-needle">
        <path d="M12 4l3 8-3-2-3 2 3-8z" fill="#5aa9ff" />
        <path d="M12 20l-3-8 3 2 3-2-3 8z" fill="#9aa7c4" opacity=".7" />
      </g>
    </svg>
  )
}

const Humidity = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z" stroke="currentColor" strokeWidth="1.6" /></svg>)
const UvGlyph = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" /><g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">{Array.from({length:8}).map((_,i)=>{const a=i*Math.PI/4;return <line key={i} x1={12+Math.cos(a)*7} y1={12+Math.sin(a)*7} x2={12+Math.cos(a)*9} y2={12+Math.sin(a)*9}/>})}</g></svg>)
const Gauge = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 15a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="12" y1="15" x2="15" y2="10" stroke="#5aa9ff" strokeWidth="1.8" strokeLinecap="round" /></svg>)
const Eye = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" /></svg>)
const CloudGlyph = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 18h10a4 4 0 0 0 .4-8A6 6 0 0 0 6 11a4 4 0 0 0 1 7z" stroke="currentColor" strokeWidth="1.6" /></svg>)
