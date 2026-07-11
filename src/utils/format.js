// Unit conversion + formatting helpers. The app stores everything in metric
// (as returned by Open-Meteo) and converts at render time based on the unit
// system selected by the user.

export function convTemp(c, system) {
  if (c == null) return null
  return system === 'imperial' ? c * 9 / 5 + 32 : c
}

export function convSpeed(kmh, system) {
  if (kmh == null) return null
  return system === 'imperial' ? kmh / 1.609344 : kmh
}

export function convPrecip(mm, system) {
  if (mm == null) return null
  return system === 'imperial' ? mm / 25.4 : mm
}

export function convDistance(m, system) {
  if (m == null) return null
  return system === 'imperial' ? m / 1609.344 : m / 1000 // mi or km
}

export const units = (system) => ({
  temp: '°',
  tempFull: system === 'imperial' ? '°F' : '°C',
  speed: system === 'imperial' ? 'mph' : 'km/h',
  precip: system === 'imperial' ? 'in' : 'mm',
  dist: system === 'imperial' ? 'mi' : 'km',
  press: 'hPa',
})

export const round = (n, d = 0) =>
  n == null ? '—' : (Math.round(n * 10 ** d) / 10 ** d).toLocaleString()

export function windDirection(deg) {
  if (deg == null) return '—'
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

// Format an ISO time string into a localized hour, honoring the location's
// own timezone (Open-Meteo returns local times when timezone=auto).
export function fmtHour(iso, timezone) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', hour12: true, timeZone: timezone,
  }).format(d)
}

export function fmtDay(iso, timezone, opts = { weekday: 'short' }) {
  const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''))
  return new Intl.DateTimeFormat('en-US', { ...opts, timeZone: timezone }).format(d)
}

export function fmtClock(iso, timezone) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: timezone,
  }).format(d)
}

// Given the current ISO time + sunrise/sunset, decide day vs night.
export function isDaytime(nowIso, sunriseIso, sunsetIso) {
  const now = new Date(nowIso).getTime()
  return now >= new Date(sunriseIso).getTime() && now < new Date(sunsetIso).getTime()
}
