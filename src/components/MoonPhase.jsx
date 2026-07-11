import { moonInfo } from '../utils/moon.js'

export default function MoonPhase() {
  const m = moonInfo(new Date())
  const R = 46, cx = 50, cy = 50

  return (
    <section className="card moon">
      <header className="card-head"><h2>Moon</h2></header>
      <div className="moon-body">
        <svg width="112" height="112" viewBox="0 0 100 100" className="moon-disk">
          <defs>
            <radialGradient id="moonLit" cx="42%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#fdfcf5" />
              <stop offset="100%" stopColor="#d9dbe6" />
            </radialGradient>
            <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="rgba(255,255,255,.18)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={R + 4} fill="url(#moonHalo)" />
          <circle cx={cx} cy={cy} r={R} fill="url(#moonLit)" />
          <g fill="#c3c6d4" opacity=".55">
            <circle cx="38" cy="40" r="6" />
            <circle cx="60" cy="55" r="4.5" />
            <circle cx="50" cy="34" r="3" />
            <circle cx="58" cy="70" r="3.5" />
          </g>
          <path d={shadowPath(m.illum, m.waxing, R, cx, cy)} fill="#161b2b" opacity=".92" />
        </svg>

        <div className="moon-info">
          <div className="moon-name">{m.name}</div>
          <div className="moon-illum">{Math.round(m.illum * 100)}% illuminated</div>
          <div className="moon-next">
            <span><MoonMini /> Full in {m.daysToFull}d</span>
            <span><MoonMini dark /> New in {m.daysToNew}d</span>
          </div>
          <div className="moon-trend">{m.waxing ? 'Waxing — growing brighter' : 'Waning — growing dimmer'}</div>
        </div>
      </div>
    </section>
  )
}

function shadowPath(illum, waxing, R, cx, cy) {
  const rx = R * Math.cos(illum * Math.PI)
  const outerSweep = waxing ? 0 : 1
  const innerSweep = rx > 0 ? outerSweep : 1 - outerSweep
  const top = `${cx} ${cy - R}`
  const bot = `${cx} ${cy + R}`
  return `M ${top} A ${R} ${R} 0 0 ${outerSweep} ${bot} ` +
         `A ${Math.abs(rx)} ${R} 0 0 ${innerSweep} ${top} Z`
}

const MoonMini = ({ dark }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" style={{ verticalAlign: 'middle', marginRight: 3 }}>
    <circle cx="5" cy="5" r="4" fill={dark ? '#2a3350' : '#e8ecf7'} />
  </svg>
)
