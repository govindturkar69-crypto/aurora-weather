import { convTemp, fmtHour, round } from '../utils/format.js'

// A smooth SVG area+line chart of the next 24 hours of temperature, with a
// precipitation-probability bar track underneath. Pure SVG, no libraries.
export default function TempChart({ hourly, system, timezone }) {
  const W = Math.max(720, hourly.length * 46)
  const H = 170
  const padX = 24
  const padTop = 28
  const padBottom = 42

  const temps = hourly.map((h) => convTemp(h.temp, system))
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const span = max - min || 1

  const x = (i) => padX + (i * (W - padX * 2)) / (hourly.length - 1)
  const y = (t) => padTop + (1 - (t - min) / span) * (H - padTop - padBottom)

  const pts = temps.map((t, i) => [x(i), y(t)])
  const linePath = smoothPath(pts)
  const areaPath = `${linePath} L ${x(hourly.length - 1)} ${H - padBottom} L ${x(0)} ${H - padBottom} Z`

  return (
    <div className="chart-scroll">
      <svg className="temp-chart" width={W} height={H + 34} viewBox={`0 0 ${W} ${H + 34}`}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(120,190,255,.55)" />
            <stop offset="100%" stopColor="rgba(120,190,255,0)" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8fd0ff" />
            <stop offset="100%" stopColor="#c9a7ff" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.6"
          strokeLinecap="round" strokeLinejoin="round" />

        {hourly.map((h, i) => (
          <g key={h.time}>
            {/* precip probability bar */}
            {h.pop > 0 && (
              <rect x={x(i) - 6} y={H - 8} width="12" height={Math.max(2, (h.pop / 100) * 22)}
                rx="3" fill="rgba(90,169,255,.5)" transform={`translate(0 ${-(Math.max(2, (h.pop / 100) * 22))})`} />
            )}
            <circle cx={x(i)} cy={y(temps[i])} r="2.6" fill="#eaf4ff" />
            <text x={x(i)} y={y(temps[i]) - 10} className="chart-temp">{round(temps[i])}°</text>
            <text x={x(i)} y={H + 24} className="chart-hour">{fmtHour(h.time, timezone)}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// Catmull-Rom -> cubic bezier for a smooth curve through all points.
function smoothPath(pts) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
  }
  return d
}
