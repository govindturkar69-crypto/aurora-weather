import { iconFor } from '../utils/weatherCodes.js'

export default function WeatherIcon({ code, isDay = true, size = 64 }) {
  const kind = iconFor(code, isDay)
  return (
    <svg
      className={`wicon wicon-${kind}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      {kind === 'sun' && <Sun />}
      {kind === 'moon' && <Moon />}
      {kind === 'sun-cloud' && <SunCloud />}
      {kind === 'moon-cloud' && <MoonCloud />}
      {kind === 'cloud' && <Cloud />}
      {kind === 'fog' && <Fog />}
      {kind === 'rain' && <Rain />}
      {kind === 'heavy-rain' && <Rain heavy />}
      {kind === 'snow' && <Snow />}
      {kind === 'storm' && <Storm />}
    </svg>
  )
}

const cloudPath = 'M20 44h26a10 10 0 0 0 1-19.9A14 14 0 0 0 20 27a9 9 0 0 0 0 17z'

function Sun() {
  return (
    <g className="sun-group">
      <g className="sun-rays" stroke="#ffd36b" strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4
          const x = 32 + Math.cos(a) * 22
          const y = 32 + Math.sin(a) * 22
          const x2 = 32 + Math.cos(a) * 28
          const y2 = 32 + Math.sin(a) * 28
          return <line key={i} x1={x} y1={y} x2={x2} y2={y2} />
        })}
      </g>
      <circle cx="32" cy="32" r="13" fill="url(#sunFill)" />
      <defs>
        <radialGradient id="sunFill" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="100%" stopColor="#ffb340" />
        </radialGradient>
      </defs>
    </g>
  )
}

function Moon() {
  return (
    <g className="moon-group">
      <path d="M40 20a16 16 0 1 0 8 22 13 13 0 0 1-8-22z" fill="url(#moonFill)" />
      <circle cx="30" cy="30" r="2" fill="#c7d2fe" opacity=".6" />
      <circle cx="36" cy="40" r="1.4" fill="#c7d2fe" opacity=".5" />
      <defs>
        <linearGradient id="moonFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
    </g>
  )
}

function SunCloud() {
  return (
    <g>
      <g className="sun-group" transform="translate(-6 -6) scale(.8)">
        <circle cx="30" cy="26" r="10" fill="#ffb340" />
        <g className="sun-rays" stroke="#ffd36b" strokeWidth="2.4" strokeLinecap="round">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4
            return <line key={i} x1={30 + Math.cos(a) * 14} y1={26 + Math.sin(a) * 14}
              x2={30 + Math.cos(a) * 18} y2={26 + Math.sin(a) * 18} />
          })}
        </g>
      </g>
      <path className="cloud-front" d={cloudPath} fill="#e8eefc" />
    </g>
  )
}

function MoonCloud() {
  return (
    <g>
      <path d="M28 18a10 10 0 1 0 6 15 8 8 0 0 1-6-15z" fill="#e2e8f0" />
      <path className="cloud-front" d={cloudPath} fill="#cfd8ea" />
    </g>
  )
}

function Cloud() {
  return (
    <g className="cloud-group">
      <path d={cloudPath} fill="#dbe3f4" />
      <path d="M14 50h30a8 8 0 0 0 0-9H14a4.5 4.5 0 0 0 0 9z" fill="#c3cee4" opacity=".8" />
    </g>
  )
}

function Fog() {
  return (
    <g>
      <path d={cloudPath} fill="#cfd6e6" opacity=".85" />
      <g stroke="#b6c0d6" strokeWidth="3" strokeLinecap="round" className="fog-lines">
        <line x1="14" y1="50" x2="48" y2="50" />
        <line x1="18" y1="56" x2="52" y2="56" />
        <line x1="12" y1="62" x2="44" y2="62" />
      </g>
    </g>
  )
}

function Rain({ heavy }) {
  return (
    <g>
      <path d={cloudPath} fill="#c4cde0" transform="translate(0 -6)" />
      <g className="rain-drops" stroke="#5aa9ff" strokeWidth={heavy ? 3.4 : 2.6} strokeLinecap="round">
        <line x1="24" y1="46" x2="21" y2="56" style={{ animationDelay: '0s' }} />
        <line x1="33" y1="46" x2="30" y2="58" style={{ animationDelay: '.25s' }} />
        <line x1="42" y1="46" x2="39" y2="56" style={{ animationDelay: '.5s' }} />
        {heavy && <line x1="48" y1="46" x2="45" y2="57" style={{ animationDelay: '.15s' }} />}
      </g>
    </g>
  )
}

function Snow() {
  return (
    <g>
      <path d={cloudPath} fill="#cdd6e8" transform="translate(0 -6)" />
      <g className="snow-flakes" fill="#e8f1ff">
        <circle cx="24" cy="52" r="2.6" style={{ animationDelay: '0s' }} />
        <circle cx="33" cy="55" r="2.6" style={{ animationDelay: '.4s' }} />
        <circle cx="42" cy="52" r="2.6" style={{ animationDelay: '.8s' }} />
      </g>
    </g>
  )
}

function Storm() {
  return (
    <g>
      <path d={cloudPath} fill="#9aa7c4" transform="translate(0 -6)" />
      <path className="lightning" d="M33 44l-8 12h7l-3 10 12-15h-8l4-7z" fill="#ffd84d" />
    </g>
  )
}
