import { useEffect, useMemo, useState } from 'react'
import { useWeather } from './hooks/useWeather.js'
import { coordsToPlace, geolocate } from './api/weather.js'
import AnimatedBackground from './components/AnimatedBackground.jsx'
import SearchBar from './components/SearchBar.jsx'
import SavedLocations from './components/SavedLocations.jsx'
import CurrentWeather from './components/CurrentWeather.jsx'
import HourlyForecast from './components/HourlyForecast.jsx'
import DailyForecast from './components/DailyForecast.jsx'
import Details from './components/Details.jsx'
import SunArc from './components/SunArc.jsx'
import AirQuality from './components/AirQuality.jsx'
import Pollen from './components/Pollen.jsx'
import RainNowcast from './components/RainNowcast.jsx'
import MoonPhase from './components/MoonPhase.jsx'

const LS_SAVED = 'aurora.saved'
const LS_UNITS = 'aurora.units'
const LS_LAST = 'aurora.last'

const DEFAULT_PLACE = {
  id: 'london', name: 'London', admin: 'England', country: 'United Kingdom',
  countryCode: 'GB', latitude: 51.5074, longitude: -0.1278,
}

export default function App() {
  const [system, setSystem] = useState(() => localStorage.getItem(LS_UNITS) || 'metric')
  const [place, setPlace] = useState(() => readJSON(LS_LAST) || DEFAULT_PLACE)
  const [saved, setSaved] = useState(() => readJSON(LS_SAVED) || [DEFAULT_PLACE])
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState(null)

  const { data, loading, error, updatedAt, refresh } = useWeather(place)

  useEffect(() => localStorage.setItem(LS_UNITS, system), [system])
  useEffect(() => localStorage.setItem(LS_SAVED, JSON.stringify(saved)), [saved])
  useEffect(() => localStorage.setItem(LS_LAST, JSON.stringify(place)), [place])

  useEffect(() => {
    if (localStorage.getItem(LS_LAST)) return
    handleGeolocate(true)

  }, [])

  const isSaved = useMemo(() => saved.some((p) => p.id === place.id), [saved, place])

  async function handleGeolocate(silent = false) {
    setGeoLoading(true); setGeoError(null)
    try {
      const { lat, lon } = await geolocate()
      setPlace(coordsToPlace(lat, lon, 'My Location'))
    } catch (e) {
      if (!silent) setGeoError('Location access denied or unavailable.')
    } finally {
      setGeoLoading(false)
    }
  }

  function toggleSave() {
    setSaved((s) => isSaved ? s.filter((p) => p.id !== place.id) : [...s, place])
  }

  const bgCode = data?.current?.code ?? 0
  const bgDay = data?.current?.isDay ?? true

  return (
    <div className="app">
      <AnimatedBackground code={bgCode} isDay={bgDay} />

      <div className="app-inner">
        <header className="topbar">
          <div className="brand">
            <LogoGlyph />
            <span>Aurora<span className="brand-light">Weather</span></span>
          </div>
          <div className="topbar-tools">
            <SearchBar
              onSelect={setPlace}
              onGeolocate={() => handleGeolocate(false)}
              geoLoading={geoLoading}
            />
            <div className="unit-toggle" role="group" aria-label="Units">
              <button className={system === 'metric' ? 'on' : ''} onClick={() => setSystem('metric')}>°C</button>
              <button className={system === 'imperial' ? 'on' : ''} onClick={() => setSystem('imperial')}>°F</button>
            </div>
          </div>
        </header>

        <SavedLocations
          places={saved}
          activeId={place.id}
          onSelect={setPlace}
          onRemove={(id) => setSaved((s) => s.filter((p) => p.id !== id))}
        />

        {geoError && <div className="banner warn">{geoError}</div>}
        {error && <div className="banner error">Couldn’t load weather: {error} <button onClick={refresh}>Retry</button></div>}

        {!data && loading && <SkeletonHero />}

        {data && (
          <main className={`layout ${loading ? 'refreshing' : ''}`}>
            <div className="col-hero">
              <div className="hero-actions">
                <button className={`save-btn ${isSaved ? 'saved' : ''}`} onClick={toggleSave}>
                  <Star filled={isSaved} /> {isSaved ? 'Saved' : 'Save location'}
                </button>
                <button className="refresh-btn" onClick={refresh} title="Refresh now">
                  <RefreshGlyph spinning={loading} />
                </button>
              </div>
              <CurrentWeather data={data} system={system} />
              <RainNowcast nowcast={data.nowcast} timezone={data.timezone} system={system} />
              <SunArc data={data} />
              <MoonPhase />
            </div>

            <div className="col-main">
              <HourlyForecast data={data} system={system} />
              <Details data={data} system={system} />
              <AirQuality air={data.air} />
              <Pollen pollen={data.pollen} />
              <DailyForecast data={data} system={system} />
            </div>
          </main>
        )}

        <footer className="foot">
          {updatedAt && <span>Updated {updatedAt.toLocaleTimeString()}</span>}
          <span className="dot">•</span>
          <span>Live data from <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></span>
        </footer>
      </div>
    </div>
  )
}

function readJSON(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}

function SkeletonHero() {
  return (
    <div className="skeleton">
      <div className="sk-line w40" />
      <div className="sk-circle" />
      <div className="sk-line w20" />
      <div className="sk-grid">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="sk-tile" />)}</div>
    </div>
  )
}

const LogoGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="10" r="4.5" fill="#ffd36b" />
    <path d="M8 18h9a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 8 12a3 3 0 0 0 0 6z" fill="#dbe7ff" />
  </svg>
)
const Star = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? '#ffd36b' : 'none'}>
    <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3z"
      stroke={filled ? '#ffd36b' : 'currentColor'} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)
const RefreshGlyph = ({ spinning }) => (
  <svg className={spinning ? 'spin' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 11a8 8 0 1 0-.6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 4v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
