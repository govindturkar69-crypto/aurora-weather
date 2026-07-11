<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=Aurora%20Weather&fontSize=62&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Live%20%E2%80%A2%20Real-time%20%E2%80%A2%20Beautifully%20animated&descSize=18&descAlignY=58" width="100%" />

<a href="https://github.com/govindturkar69-crypto/aurora-weather">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=5AA9FF&center=true&vCenter=true&width=620&lines=Everything+is+live.+Nothing+is+fake.;Real+forecasts+%E2%80%A2+Air+quality+%E2%80%A2+Moon+phase;Powered+by+the+free+Open-Meteo+API;React+%2B+Vite+%E2%80%A2+Zero+API+keys" alt="Typing SVG" />
</a>

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Open-Meteo](https://img.shields.io/badge/Data-Open--Meteo-00A6ED?style=for-the-badge&logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-4ADE80?style=for-the-badge)
[![Live](https://img.shields.io/badge/%F0%9F%8C%90_LIVE_SITE-aurora--weather--six.vercel.app-5AA9FF?style=for-the-badge)](https://aurora-weather-six.vercel.app/)

<br/>

**[🌤️ Live Demo](https://aurora-weather-six.vercel.app)** &nbsp;•&nbsp; **[🚀 Deploy your own](#-deployment)** &nbsp;•&nbsp; **[✨ Features](#-features)**

</div>

<br/>

## 🌍 Overview

**Aurora Weather** is an advanced, fully live weather app where every single number is real —
pulled in real time from the free, key-less **[Open-Meteo](https://open-meteo.com/)** API.
No sign-up, no API keys, no cost. Just fast, gorgeous, accurate weather with a UI that
reacts to the actual conditions outside.

<div align="center">

`Real data` &nbsp;·&nbsp; `Animated sky` &nbsp;·&nbsp; `Air quality` &nbsp;·&nbsp; `Moon phase` &nbsp;·&nbsp; `Rain nowcast` &nbsp;·&nbsp; `Pollen`

</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%" />

## ✨ Features

| | Feature | What it does |
|:--:|:--|:--|
| 🌡️ | **Live current conditions** | Temperature, feels-like, humidity, wind + gusts, pressure, cloud cover, visibility, UV index — all real-time |
| 🔎 | **Search anywhere** | Debounced autocomplete geocoding for any city, town or place on Earth |
| 📍 | **Use my location** | One-tap geolocation for instant local weather |
| ⏱️ | **24-hour outlook** | Smooth SVG temperature curve with precipitation probability + hour-by-hour cards |
| 📅 | **14-day forecast** | Expandable day rows with high/low range bars and full detail |
| 💨 | **Air quality** | Live US AQI gauge with PM2.5, PM10, O₃, NO₂, SO₂, CO |
| 🌧️ | **Rain nowcast** | 15-minutely precipitation for the next 3 hours — *"Rain starting in ~30 min"* |
| 🌸 | **Pollen** | Live grass / tree / weed pollen levels (CAMS, strongest over Europe) |
| 🌙 | **Moon phase** | Tonight's exact phase, illumination % and days to next full/new — pure astronomy math |
| 🎨 | **Animated backgrounds** | A canvas particle system that reacts to the weather: rain streaks, drifting snow, twinkling stars, fog, storm lightning — day/night skies switch automatically |
| 🔁 | **Metric ⇄ Imperial** | Instant unit toggle |
| ⭐ | **Saved locations** | Quick-switch chips, remembered between sessions |
| ♻️ | **Auto-refresh** | Fresh data every 10 minutes |

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%" />

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-0f172a?style=for-the-badge&logo=vite&logoColor=646CFF)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/SVG-FFB13B?style=for-the-badge&logo=svg&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

- **No UI framework bloat** — hand-built components, pure CSS, and library-free SVG charts
- **Canvas** particle engine for the animated atmosphere
- **Astronomical math** for the moon (no data fetched)

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the URL Vite prints (usually **http://localhost:5173**).

```bash
# Production build
npm run build
npm run preview
```

> Requires **Node.js 18+**. No API keys or environment variables needed — it just works.

## ☁️ Deployment

Deploy the static build anywhere. Fastest path with **Vercel**:

1. Push this repo to GitHub
2. Go to **[vercel.com](https://vercel.com)** → **Add New → Project** → import the repo
3. Vercel auto-detects **Vite** (build `npm run build`, output `dist`) → **Deploy**

Every future push auto-deploys. 🎉

## 📡 Data Sources

| Source | Used for |
|:--|:--|
| [Open-Meteo Forecast](https://open-meteo.com/en/docs) | Current, hourly, 14-day, 15-minutely precipitation |
| [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) | US AQI, pollutants, pollen |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City / place search |

*All free, key-less, and open. Moon phase is computed locally from astronomical constants.*

## 📁 Project Structure

```
weather-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # entry
    ├── App.jsx             # layout + state
    ├── index.css           # all styling + animations
    ├── api/weather.js      # live Open-Meteo data layer
    ├── hooks/useWeather.js # fetch, normalize, auto-refresh
    ├── utils/              # formatting, weather codes, moon math
    └── components/         # 14 UI components
```

<br/>

<div align="center">

### 💙 Built with real data and a lot of care

*Everything you see is live. Nothing is fake.*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%" />

</div>
