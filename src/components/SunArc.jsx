import { fmtClock } from '../utils/format.js'

export default function SunArc({ data }) {
  const t = data.today
  if (!t.sunrise || !t.sunset) return null

  const rise = new Date(t.sunrise).getTime()
  const set = new Date(t.sunset).getTime()
  const now = new Date(data.current.time || Date.now()).getTime()
  const progress = Math.max(0, Math.min(1, (now - rise) / (set - rise)))
  const daylightH = (set - rise) / 3600000

  const W = 260, H = 120, cx = W / 2, cy = 104, r = 96
  const angle = Math.PI * (1 - progress)
  const sunX = cx + Math.cos(angle) * r
  const sunY = cy - Math.sin(angle) * r
  const isUp = progress > 0 && progress < 1

  return (
    <section className="card sunarc">
      <header className="card-head"><h2>Sun</h2></header>
      <div className="sun-wrap">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffb340" />
              <stop offset="50%" stopColor="#ffd36b" />
              <stop offset="100%" stopColor="#ff9d5c" />
            </linearGradient>
          </defs>
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" strokeDasharray="3 5" />
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`}
            fill="none" stroke="url(#arcGrad)" strokeWidth="3" strokeLinecap="round" />
          <line x1={cx - r - 6} y1={cy} x2={cx + r + 6} y2={cy} stroke="rgba(255,255,255,.25)" strokeWidth="1.5" />
          {isUp && (
            <g>
              <circle cx={sunX} cy={sunY} r="9" fill="#ffd36b" className="sun-dot" />
              <circle cx={sunX} cy={sunY} r="15" fill="#ffd36b" opacity=".25" />
            </g>
          )}
        </svg>
        <div className="sun-times">
          <div><span className="st-label">Sunrise</span><span className="st-val">{fmtClock(t.sunrise, data.timezone)}</span></div>
          <div className="st-center"><span className="st-label">Daylight</span><span className="st-val">{daylightH.toFixed(1)} h</span></div>
          <div className="st-right"><span className="st-label">Sunset</span><span className="st-val">{fmtClock(t.sunset, data.timezone)}</span></div>
        </div>
      </div>
    </section>
  )
}
