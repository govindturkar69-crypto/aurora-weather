import { useState } from 'react'
import WeatherIcon from './WeatherIcon.jsx'
import { describe } from '../utils/weatherCodes.js'
import { convTemp, fmtDay, round, units, windDirection, convSpeed } from '../utils/format.js'

// 14-day outlook. Each row shows a mini temperature range bar positioned within
// the week's overall min/max, plus an expandable detail drawer.
export default function DailyForecast({ data, system }) {
  const [open, setOpen] = useState(null)
  const u = units(system)
  const days = data.daily

  const weekMin = Math.min(...days.map((d) => d.tMin))
  const weekMax = Math.max(...days.map((d) => d.tMax))
  const weekSpan = weekMax - weekMin || 1

  return (
    <section className="card daily">
      <header className="card-head"><h2>14-day forecast</h2></header>
      <div className="day-list">
        {days.map((d, i) => {
          const left = ((d.tMin - weekMin) / weekSpan) * 100
          const width = ((d.tMax - d.tMin) / weekSpan) * 100
          const isOpen = open === i
          return (
            <div className={`day-item ${isOpen ? 'open' : ''}`} key={d.date}>
              <button className="day-row" onClick={() => setOpen(isOpen ? null : i)}>
                <span className="day-name">{i === 0 ? 'Today' : fmtDay(d.date, data.timezone)}</span>
                <span className="day-pop">
                  {d.pop > 0 ? <><Drop />{round(d.pop)}%</> : ''}
                </span>
                <WeatherIcon code={d.code} isDay size={30} />
                <span className="day-min">{round(convTemp(d.tMin, system))}°</span>
                <span className="range-track">
                  <span className="range-fill" style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }} />
                </span>
                <span className="day-max">{round(convTemp(d.tMax, system))}°</span>
              </button>

              {isOpen && (
                <div className="day-detail">
                  <p className="dd-cond">{describe(d.code).label}</p>
                  <div className="dd-grid">
                    <Item label="Feels max" val={`${round(convTemp(d.feelsMax, system))}${u.temp}`} />
                    <Item label="Feels min" val={`${round(convTemp(d.feelsMin, system))}${u.temp}`} />
                    <Item label="Rain chance" val={`${round(d.pop || 0)}%`} />
                    <Item label="Precip" val={`${round(d.precip || 0, 1)} ${u.precip}`} />
                    <Item label="UV max" val={round(d.uvMax || 0, 1)} />
                    <Item label="Wind max" val={`${round(convSpeed(d.windMax, system))} ${u.speed}`} />
                    <Item label="Gusts" val={`${round(convSpeed(d.gustMax, system))} ${u.speed}`} />
                    <Item label="Wind dir" val={windDirection(d.windDir)} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

const Item = ({ label, val }) => (
  <div className="dd-item"><span className="dd-label">{label}</span><span className="dd-val">{val}</span></div>
)

const Drop = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginRight: 2 }}>
    <path d="M12 3s7 8 7 12a7 7 0 0 1-14 0c0-4 7-12 7-12z" fill="#5aa9ff" />
  </svg>
)
