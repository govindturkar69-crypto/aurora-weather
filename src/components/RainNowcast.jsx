import { fmtHour } from '../utils/format.js'
import { convPrecip, units } from '../utils/format.js'

export default function RainNowcast({ nowcast, timezone, system }) {
  if (!nowcast || !nowcast.steps?.length) return null
  const u = units(system)
  const max = Math.max(nowcast.peak, 0.5)

  return (
    <section className="card nowcast">
      <header className="card-head"><h2>Next 3 hours</h2></header>
      <div className={`nowcast-headline ${nowcast.nowRaining ? 'wet' : 'dry'}`}>
        <Drop active={nowcast.nowRaining} />
        <span>{nowcast.summary}</span>
      </div>
      <div className="nowcast-bars">
        {nowcast.steps.map((s, i) => {
          const h = Math.max(3, (s.precip / max) * 46)
          return (
            <div className="nc-col" key={s.time} title={`${convPrecip(s.precip, system).toFixed(2)} ${u.precip} · ${Math.round(s.pop)}%`}>
              <div className="nc-bar-wrap">
                <div className="nc-bar" style={{ height: `${h}px`, opacity: s.precip > 0.05 ? 1 : 0.25 }} />
              </div>
              {i % 2 === 0 && <span className="nc-time">{fmtHour(s.time, timezone)}</span>}
            </div>
          )
        })}
      </div>
      <div className="nowcast-scale">
        <span>now</span><span>+3h</span>
      </div>
    </section>
  )
}

const Drop = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3s7 8 7 12a7 7 0 0 1-14 0c0-4 7-12 7-12z" fill={active ? '#5aa9ff' : 'none'} stroke="#5aa9ff" strokeWidth="1.6" />
  </svg>
)
