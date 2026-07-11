import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchWeather, fetchAirQuality } from '../api/weather.js'

export function useWeather(place) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const timer = useRef(null)

  const load = useCallback(async (silent = false) => {
    if (!place) return
    if (!silent) setLoading(true)
    setError(null)
    try {
      const [wx, aq] = await Promise.all([
        fetchWeather(place.latitude, place.longitude),
        fetchAirQuality(place.latitude, place.longitude),
      ])
      setData(normalize(wx, aq, place))
      setUpdatedAt(new Date())
    } catch (e) {
      setError(e.message || 'Failed to load weather')
    } finally {
      setLoading(false)
    }
  }, [place])

  useEffect(() => {
    load()
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => load(true), 10 * 60 * 1000)
    return () => timer.current && clearInterval(timer.current)
  }, [load])

  return { data, loading, error, updatedAt, refresh: () => load(false) }
}

function normalize(wx, aq, place) {
  const tz = wx.timezone
  const c = wx.current
  const hIdx = c ? nearestHourIndex(wx.hourly.time, c.time) : 0

  const hourly = []
  for (let i = hIdx; i < Math.min(hIdx + 24, wx.hourly.time.length); i++) {
    hourly.push({
      time: wx.hourly.time[i],
      temp: wx.hourly.temperature_2m[i],
      feels: wx.hourly.apparent_temperature[i],
      pop: wx.hourly.precipitation_probability?.[i],
      precip: wx.hourly.precipitation?.[i],
      code: wx.hourly.weather_code[i],
      wind: wx.hourly.wind_speed_10m[i],
      windDir: wx.hourly.wind_direction_10m[i],
      humidity: wx.hourly.relative_humidity_2m?.[i],
      uv: wx.hourly.uv_index?.[i],
      isDay: wx.hourly.is_day?.[i] === 1,
      visibility: wx.hourly.visibility?.[i],
    })
  }

  const daily = wx.daily.time.map((t, i) => ({
    date: t,
    code: wx.daily.weather_code[i],
    tMax: wx.daily.temperature_2m_max[i],
    tMin: wx.daily.temperature_2m_min[i],
    feelsMax: wx.daily.apparent_temperature_max[i],
    feelsMin: wx.daily.apparent_temperature_min[i],
    sunrise: wx.daily.sunrise[i],
    sunset: wx.daily.sunset[i],
    uvMax: wx.daily.uv_index_max?.[i],
    precip: wx.daily.precipitation_sum?.[i],
    pop: wx.daily.precipitation_probability_max?.[i],
    windMax: wx.daily.wind_speed_10m_max?.[i],
    gustMax: wx.daily.wind_gusts_10m_max?.[i],
    windDir: wx.daily.wind_10m_direction_dominant?.[i] ?? wx.daily.wind_direction_10m_dominant?.[i],
  }))

  const today = daily[0] || {}

  const nowcast = buildNowcast(wx.minutely_15, c?.time)

  return {
    place,
    timezone: tz,
    current: {
      time: c?.time,
      temp: c?.temperature_2m,
      feels: c?.apparent_temperature,
      humidity: c?.relative_humidity_2m,
      code: c?.weather_code,
      isDay: c?.is_day === 1,
      precip: c?.precipitation,
      cloud: c?.cloud_cover,
      pressure: c?.pressure_msl ?? c?.surface_pressure,
      wind: c?.wind_speed_10m,
      windDir: c?.wind_direction_10m,
      gust: c?.wind_gusts_10m,
      uv: hourly[0]?.uv,
      visibility: hourly[0]?.visibility,
    },
    today,
    hourly,
    daily,
    air: aq?.current
      ? {
          aqi: aq.current.us_aqi,
          pm25: aq.current.pm2_5,
          pm10: aq.current.pm10,
          no2: aq.current.nitrogen_dioxide,
          o3: aq.current.ozone,
          so2: aq.current.sulphur_dioxide,
          co: aq.current.carbon_monoxide,
        }
      : null,
    pollen: aq?.current && aq.current.grass_pollen != null
      ? {
          alder: aq.current.alder_pollen,
          birch: aq.current.birch_pollen,
          grass: aq.current.grass_pollen,
          mugwort: aq.current.mugwort_pollen,
          olive: aq.current.olive_pollen,
          ragweed: aq.current.ragweed_pollen,
        }
      : null,
    nowcast,
  }
}

function buildNowcast(m15, nowIso) {
  if (!m15 || !m15.time) return null
  const now = nowIso ? new Date(nowIso).getTime() : Date.now()
  const startIdx = Math.max(0, m15.time.findIndex((t) => new Date(t).getTime() >= now - 15 * 60000))
  const steps = []
  for (let i = startIdx; i < Math.min(startIdx + 12, m15.time.length); i++) {
    steps.push({
      time: m15.time[i],
      precip: m15.precipitation?.[i] ?? 0,
      pop: m15.precipitation_probability?.[i] ?? 0,
    })
  }
  if (!steps.length) return null

  const raining = (s) => s.precip > 0.05
  const nowRaining = raining(steps[0])
  let summary
  if (nowRaining) {
    const stop = steps.findIndex((s, i) => i > 0 && !raining(s))
    summary = stop === -1
      ? 'Rain continuing for the next 3 hours'
      : `Rain easing in about ${stop * 15} min`
  } else {
    const start = steps.findIndex((s) => raining(s))
    summary = start === -1
      ? 'Dry for the next 3 hours'
      : `Rain starting in about ${start * 15} min`
  }
  const peak = Math.max(...steps.map((s) => s.precip))
  return { steps, summary, nowRaining, peak }
}

function nearestHourIndex(times, target) {
  const t = new Date(target).getTime()
  let best = 0
  let bestDiff = Infinity
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - t)
    if (diff < bestDiff) { bestDiff = diff; best = i }
  }
  return best
}