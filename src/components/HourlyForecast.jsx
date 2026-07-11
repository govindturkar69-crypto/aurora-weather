import { useState } from 'react'
import TempChart from './TempChart.jsx'
import WeatherIcon from './WeatherIcon.jsx'
import { convTemp, fmtHour, round, units } from '../utils/format.js'

export default function HourlyForecast({ data, system }) {
  const [view, setView] = useState('chart')
  const u = units(system)

  return (
    <section className="card hourly">
      <header className="card-head">
        <h2>Next 24 hours</h2>
        <div className="seg">
          <button className={view === 'chart' ? 'on' : ''} onClick={() => setView('chart')}>Chart</button>
          <button className={view === 'cards' ? 'on' : ''} onClick={() => setView('cards')}>Hourly</button>
        </div>
      </header>

      {view === 'chart' ? (
        <TempChart hourly={data.hourly} system={system} timezone={data.timezone} />
      ) : (
        <div className="hour-row">
          {data.hourly.map((h, i) => (
            <div className="hour-card" key={h.time}>
              <span className="hour-time">{i === 0 ? 'Now' : fmtHour(h.time, data.timezone)}</span>
              <WeatherIcon code={h.code} isDay={h.isDay} size={38} />
              <span className="hour-temp">{round(convTemp(h.temp, system))}{u.temp}</span>
              <span className="hour-pop">
                {h.pop > 0 ? <><Drop /> {round(h.pop)}%</> : <span className="muted">—</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

const Drop = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}>
    <path d="M12 3s7 8 7 12a7 7 0 0 1-14 0c0-4 7-12 7-12z" fill="#5aa9ff" />
  </svg>
)
