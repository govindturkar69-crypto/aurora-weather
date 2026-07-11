import { aqiCategory } from '../utils/weatherCodes.js'
import { round } from '../utils/format.js'

export default function AirQuality({ air }) {
  if (!air || air.aqi == null) return null
  const cat = aqiCategory(air.aqi)
  const pct = Math.min((air.aqi / 300) * 100, 100)

  return (
    <section className="card air">
      <header className="card-head"><h2>Air quality</h2></header>
      <div className="air-body">
        <div className="aqi-gauge">
          <div className="aqi-number" style={{ color: cat.color }}>{round(air.aqi)}</div>
          <div className="aqi-label" style={{ color: cat.color }}>{cat.label}</div>
          <div className="aqi-scale">
            <span className="aqi-fill" style={{ width: `${pct}%`, background: cat.color }} />
          </div>
          <div className="aqi-caption">US AQI</div>
        </div>
        <div className="pollutants">
          <Poll label="PM2.5" val={air.pm25} unit="µg/m³" />
          <Poll label="PM10" val={air.pm10} unit="µg/m³" />
          <Poll label="O₃" val={air.o3} unit="µg/m³" />
          <Poll label="NO₂" val={air.no2} unit="µg/m³" />
          <Poll label="SO₂" val={air.so2} unit="µg/m³" />
          <Poll label="CO" val={air.co} unit="µg/m³" />
        </div>
      </div>
    </section>
  )
}

const Poll = ({ label, val, unit }) => (
  <div className="poll">
    <span className="poll-label">{label}</span>
    <span className="poll-val">{val == null ? '—' : round(val, 1)}</span>
    <span className="poll-unit">{unit}</span>
  </div>
)
