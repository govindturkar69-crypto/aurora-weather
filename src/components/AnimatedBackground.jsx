import { useEffect, useRef } from 'react'
import { describe } from '../utils/weatherCodes.js'

// Gradient palettes keyed by theme + day/night. These paint the atmosphere
// behind everything; the canvas particle layer sits on top.
const SKIES = {
  clear:  { day: ['#4a90e2', '#7ec4f5', '#bfe3ff'], night: ['#0b1026', '#152046', '#243b6b'] },
  partly: { day: ['#5b93d6', '#8fbde8', '#cfe6f7'], night: ['#0d1330', '#1c2a52', '#33507f'] },
  cloudy: { day: ['#7b8aa3', '#9aa8bd', '#c3ccd9'], night: ['#161b2b', '#282f45', '#3d465f'] },
  fog:    { day: ['#9aa3ad', '#b6bcc4', '#d7dbe0'], night: ['#1a1e28', '#2b3040', '#454b5c'] },
  rain:   { day: ['#48607a', '#6a7f97', '#93a4b8'], night: ['#0c1220', '#1a2436', '#2c3a52'] },
  storm:  { day: ['#2f3a4d', '#454f64', '#5d6883'], night: ['#080b16', '#141a2b', '#242c44'] },
  snow:   { day: ['#8fa3bd', '#b7c6da', '#e4edf7'], night: ['#141a2e', '#28324c', '#48597e'] },
}

export default function AnimatedBackground({ code = 0, isDay = true }) {
  const canvasRef = useRef(null)
  const theme = describe(code).theme
  const timeKey = isDay ? 'day' : 'night'
  const palette = (SKIES[theme] || SKIES.clear)[timeKey]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let w, h
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Build the particle set appropriate to the current weather.
    const parts = buildParticles(theme, isDay, () => ({ w, h }))
    let lightningTimer = 0
    let flash = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // Storm lightning flashes.
      if (theme === 'storm') {
        lightningTimer -= 1
        if (lightningTimer <= 0 && Math.random() < 0.01) { flash = 1; lightningTimer = 40 }
        if (flash > 0) {
          ctx.fillStyle = `rgba(255,255,255,${flash * 0.35})`
          ctx.fillRect(0, 0, w, h)
          flash -= 0.05
        }
      }

      for (const p of parts) p.step(ctx, w, h)
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [theme, isDay])

  return (
    <div className="bg-atmosphere" style={{ background: `linear-gradient(160deg, ${palette[0]}, ${palette[1]} 55%, ${palette[2]})` }}>
      {isDay && (theme === 'clear' || theme === 'partly') && <div className="bg-sun-glow" />}
      {!isDay && <div className="bg-star-field" />}
      <canvas ref={canvasRef} className="bg-canvas" />
      <div className="bg-vignette" />
    </div>
  )
}

// --- Particle factory ------------------------------------------------------
function buildParticles(theme, isDay, dims) {
  const list = []
  const { w, h } = dims()
  const rand = (a, b) => a + Math.random() * (b - a)

  if (theme === 'rain' || theme === 'storm') {
    const n = theme === 'storm' ? 220 : 150
    for (let i = 0; i < n; i++) {
      let x = rand(0, w), y = rand(0, h)
      const len = rand(8, 18), sp = rand(9, 16), wind = theme === 'storm' ? 3 : 1.5
      list.push({ step(ctx, W, H) {
        ctx.strokeStyle = 'rgba(174,200,235,0.45)'
        ctx.lineWidth = 1.1
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + wind, y + len); ctx.stroke()
        y += sp; x += wind
        if (y > H) { y = -len; x = rand(0, W) }
      } })
    }
  } else if (theme === 'snow') {
    for (let i = 0; i < 90; i++) {
      let x = rand(0, w), y = rand(0, h)
      const r = rand(1.5, 3.6), sp = rand(0.6, 1.8), drift = rand(-0.6, 0.6), ph = rand(0, 6.28)
      list.push({ step(ctx, W, H) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill()
        y += sp; x += Math.sin((y + ph) / 30) * 0.6 + drift
        if (y > H) { y = -r; x = rand(0, W) }
      } })
    }
  } else if (theme === 'fog') {
    for (let i = 0; i < 6; i++) {
      let x = rand(-200, w), y = rand(h * 0.3, h)
      const r = rand(120, 260), sp = rand(0.2, 0.6)
      list.push({ step(ctx, W, H) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, 'rgba(220,226,235,0.10)')
        g.addColorStop(1, 'rgba(220,226,235,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill()
        x += sp
        if (x - r > W) { x = -r; y = rand(H * 0.3, H) }
      } })
    }
  } else if (!isDay) {
    // Night sky: twinkling stars + occasional shooting star.
    for (let i = 0; i < 120; i++) {
      const x = rand(0, w), y = rand(0, h * 0.75), r = rand(0.4, 1.6), ph = rand(0, 6.28)
      list.push({ step(ctx) {
        const tw = 0.5 + 0.5 * Math.sin(Date.now() / 600 + ph)
        ctx.fillStyle = `rgba(255,255,255,${0.3 + tw * 0.6})`
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill()
      } })
    }
  } else {
    // Clear/partly day: soft drifting clouds.
    const n = theme === 'partly' || theme === 'cloudy' ? 5 : 2
    for (let i = 0; i < n; i++) {
      let x = rand(0, w), y = rand(h * 0.08, h * 0.4)
      const r = rand(60, 140), sp = rand(0.15, 0.4)
      list.push({ step(ctx, W, H) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, 'rgba(255,255,255,0.28)')
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 6.283); ctx.fill()
        x += sp
        if (x - r > W) x = -r
      } })
    }
  }
  return list
}
