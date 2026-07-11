// WMO Weather interpretation codes (used by Open-Meteo).
// Each entry maps to a human label plus a "theme" that drives the animated
// background and accent colors. Day/night variants are resolved at render time.

export const WEATHER_CODES = {
  0:  { label: 'Clear sky',            theme: 'clear' },
  1:  { label: 'Mainly clear',         theme: 'clear' },
  2:  { label: 'Partly cloudy',        theme: 'partly' },
  3:  { label: 'Overcast',             theme: 'cloudy' },
  45: { label: 'Fog',                  theme: 'fog' },
  48: { label: 'Depositing rime fog',  theme: 'fog' },
  51: { label: 'Light drizzle',        theme: 'rain' },
  53: { label: 'Moderate drizzle',     theme: 'rain' },
  55: { label: 'Dense drizzle',        theme: 'rain' },
  56: { label: 'Light freezing drizzle', theme: 'rain' },
  57: { label: 'Dense freezing drizzle', theme: 'rain' },
  61: { label: 'Slight rain',          theme: 'rain' },
  63: { label: 'Moderate rain',        theme: 'rain' },
  65: { label: 'Heavy rain',           theme: 'rain' },
  66: { label: 'Light freezing rain',  theme: 'rain' },
  67: { label: 'Heavy freezing rain',  theme: 'rain' },
  71: { label: 'Slight snow',          theme: 'snow' },
  73: { label: 'Moderate snow',        theme: 'snow' },
  75: { label: 'Heavy snow',           theme: 'snow' },
  77: { label: 'Snow grains',          theme: 'snow' },
  80: { label: 'Slight rain showers',  theme: 'rain' },
  81: { label: 'Moderate rain showers',theme: 'rain' },
  82: { label: 'Violent rain showers', theme: 'storm' },
  85: { label: 'Slight snow showers',  theme: 'snow' },
  86: { label: 'Heavy snow showers',   theme: 'snow' },
  95: { label: 'Thunderstorm',         theme: 'storm' },
  96: { label: 'Thunderstorm, slight hail', theme: 'storm' },
  99: { label: 'Thunderstorm, heavy hail',  theme: 'storm' },
}

export function describe(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', theme: 'cloudy' }
}

// Emoji-free inline SVG glyph names -> resolved by <WeatherIcon/>.
export function iconFor(code, isDay = true) {
  if (code === 0 || code === 1) return isDay ? 'sun' : 'moon'
  if (code === 2) return isDay ? 'sun-cloud' : 'moon-cloud'
  if (code === 3) return 'cloud'
  if (code === 45 || code === 48) return 'fog'
  if ([51, 53, 55, 56, 57, 61, 63, 80, 81].includes(code)) return 'rain'
  if ([65, 66, 67, 82].includes(code)) return 'heavy-rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if ([95, 96, 99].includes(code)) return 'storm'
  return 'cloud'
}

// Air Quality Index (US AQI) category resolver.
export function aqiCategory(aqi) {
  if (aqi == null) return { label: '—', color: '#8aa', level: 0 }
  if (aqi <= 50)  return { label: 'Good',            color: '#4ade80', level: 1 }
  if (aqi <= 100) return { label: 'Moderate',        color: '#facc15', level: 2 }
  if (aqi <= 150) return { label: 'Unhealthy (SG)',  color: '#fb923c', level: 3 }
  if (aqi <= 200) return { label: 'Unhealthy',       color: '#f87171', level: 4 }
  if (aqi <= 300) return { label: 'Very Unhealthy',  color: '#c084fc', level: 5 }
  return { label: 'Hazardous', color: '#f472b6', level: 6 }
}

// UV index category resolver.
export function uvCategory(uv) {
  if (uv == null) return { label: '—', color: '#8aa' }
  if (uv < 3)  return { label: 'Low',       color: '#4ade80' }
  if (uv < 6)  return { label: 'Moderate',  color: '#facc15' }
  if (uv < 8)  return { label: 'High',      color: '#fb923c' }
  if (uv < 11) return { label: 'Very High', color: '#f87171' }
  return { label: 'Extreme', color: '#c084fc' }
}
