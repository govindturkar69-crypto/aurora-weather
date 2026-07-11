# 🌤️ Aurora Weather

A fully live, advanced weather app built with React + Vite. Every number is real,
pulled in real time from the free **[Open-Meteo](https://open-meteo.com/)** APIs —
**no API key, no sign-up, no cost.**

## Features

- **Live current conditions** — temperature, feels-like, humidity, wind + gusts,
  pressure, cloud cover, visibility, UV index.
- **Search anywhere** — debounced autocomplete geocoding for any city, town or place.
- **Use my location** — one tap geolocation for real local weather.
- **24-hour outlook** — smooth SVG temperature curve with precipitation
  probability, plus a scrollable hour-by-hour card view.
- **14-day forecast** — expandable day rows with high/low range bars and full detail.
- **Air quality** — live US AQI gauge with PM2.5, PM10, O₃, NO₂, SO₂, CO.
- **Animated precipitation radar** — a live Leaflet map with real radar frames
  from RainViewer (free, no key): plays the last ~2 hours plus a short nowcast,
  with play/pause and a scrub timeline.
- **Rain-in-X-minutes nowcast** — 15-minutely precipitation for the next 3 hours
  with a plain-language headline ("Rain starting in about 30 min").
- **Pollen** — live grass/tree/weed pollen (CAMS via Open-Meteo), strongest over Europe.
- **Moon phase** — tonight's exact phase, illumination %, and days to the next
  full/new moon, computed from real astronomical math (nothing fetched).
- **Sun tracker** — animated sunrise/sunset arc showing the sun's real position
  and total daylight.
- **Animated backgrounds** — a canvas particle system that reacts to the actual
  weather: rain streaks, drifting snow, twinkling night stars, shooting clouds,
  fog banks, and lightning flashes during storms. Day/night skies switch automatically.
- **Metric ⇄ Imperial** toggle, **saved locations**, auto-refresh every 10 minutes.
- Fully **responsive** and respects `prefers-reduced-motion`.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To build a production bundle:

```bash
npm run build
npm run preview
```

## How it works

- `src/api/weather.js` — the live data layer (geocoding, forecast, air quality).
- `src/hooks/useWeather.js` — fetches, normalizes, and auto-refreshes the data.
- `src/components/` — all UI, including the canvas `AnimatedBackground` and the
  library-free SVG `TempChart`.
- `src/utils/` — unit conversion, formatting, and WMO weather-code mapping.

No tracking, no keys, no backend. Just live weather.
