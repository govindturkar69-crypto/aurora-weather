// ---------------------------------------------------------------------------
// Live data layer. Everything here hits the free, key-less Open-Meteo APIs:
//   - Geocoding:   https://geocoding-api.open-meteo.com
//   - Forecast:    https://api.open-meteo.com
//   - Air Quality: https://air-quality-api.open-meteo.com
// No API key, no auth, real-time data. https://open-meteo.com/en/docs
// ---------------------------------------------------------------------------

const GEO = 'https://geocoding-api.open-meteo.com/v1'
const FORECAST = 'https://api.open-meteo.com/v1/forecast'
const AIR = 'https://air-quality-api.open-meteo.com/v1/air-quality'

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json()
}

// --- Location search (autocomplete) ---------------------------------------
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return []
  const url = `${GEO}/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
  const data = await getJSON(url)
  return (data.results || []).map(normalizePlace)
}

// Reverse-ish lookup: geocoding API doesn't offer reverse geocode, so we label
// coordinates generically and let the forecast timezone fill context.
export function coordsToPlace(lat, lon, label = 'My Location') {
  return {
    id: `${lat.toFixed(3)},${lon.toFixed(3)}`,
    name: label,
    admin: '',
    country: '',
    countryCode: '',
    latitude: lat,
    longitude: lon,
  }
}

function normalizePlace(r) {
  return {
    id: r.id,
    name: r.name,
    admin: r.admin1 || '',
    country: r.country || '',
    countryCode: r.country_code || '',
    latitude: r.latitude,
    longitude: r.longitude,
  }
}

// --- Full forecast bundle --------------------------------------------------
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone: 'auto',
    current: [
      'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
      'is_day', 'precipitation', 'weather_code', 'cloud_cover',
      'pressure_msl', 'surface_pressure', 'wind_speed_10m',
      'wind_direction_10m', 'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m', 'apparent_temperature', 'precipitation_probability',
      'precipitation', 'weather_code', 'wind_speed_10m', 'wind_direction_10m',
      'relative_humidity_2m', 'uv_index', 'is_day', 'visibility',
    ].join(','),
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min',
      'apparent_temperature_max', 'apparent_temperature_min',
      'sunrise', 'sunset', 'uv_index_max', 'precipitation_sum',
      'precipitation_probability_max', 'wind_speed_10m_max',
      'wind_gusts_10m_max', 'wind_direction_10m_dominant',
    ].join(','),
    minutely_15: 'precipitation,precipitation_probability',
    forecast_minutely_15: '12', // next 3 hours at 15-min resolution
    forecast_days: '14',
  })
  const data = await getJSON(`${FORECAST}?${params.toString()}`)
  return data
}

// --- Air quality (US AQI + pollutants) ------------------------------------
export async function fetchAirQuality(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone: 'auto',
    current: [
      'us_aqi', 'pm2_5', 'pm10', 'nitrogen_dioxide',
      'ozone', 'sulphur_dioxide', 'carbon_monoxide',
      // Pollen (CAMS) — high-quality coverage over Europe; null elsewhere.
      'alder_pollen', 'birch_pollen', 'grass_pollen',
      'mugwort_pollen', 'olive_pollen', 'ragweed_pollen',
    ].join(','),
  })
  try {
    return await getJSON(`${AIR}?${params.toString()}`)
  } catch {
    return null // air quality is best-effort; app still works without it
  }
}

// Convenience: geolocate the browser, resolving to coords.
export function geolocate() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation unsupported'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  })
}