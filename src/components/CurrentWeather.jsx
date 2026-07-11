import WeatherIcon from './WeatherIcon.jsx'
import { describe } from '../utils/weatherCodes.js'
import { convTemp, round, units } from '../utils/format.js'

export default function CurrentWeather({ data, system }) {
  const c = data.current
  const u = units(system)
  const cond = describe(c.code)
  const t = data.today

  return (
    <section className="hero">
      <div className="hero-place">
        <h1>{data.place.name}</h1>
        <p className="hero-sub">
          {[data.place.admin, data.place.country].filter(Boolean).join(', ') || data.timezone}
        </p>
      </div>

      <div className="hero-main">
        <div className="hero-icon">
          <WeatherIcon code={c.code} isDay={c.isDay} size={130} />
        </div>
        <div className="hero-temp">
          <span className="temp-value">{round(convTemp(c.temp, system))}</span>
          <span className="temp-unit">{u.tempFull}</span>
        </div>
      </div>

      <p className="hero-cond">{cond.label}</p>

      <div className="hero-meta">
        <span>Feels like {round(convTemp(c.feels, system))}{u.temp}</span>
        <span className="dot">•</span>
        <span className="hl">
          <ArrowUp /> {round(convTemp(t.tMax, system))}{u.temp}
          <ArrowDown /> {round(convTemp(t.tMin, system))}{u.temp}
        </span>
      </div>
    </section>
  )
}

const ArrowUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}>
    <path d="M12 5v14M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ArrowDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginLeft: 8 }}>
    <path d="M12 19V5M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
