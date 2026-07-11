// Moon phase computed from real astronomical constants — no network, no fakery.
// Based on the mean synodic month and a known reference new moon.

const SYNODIC = 29.530588853 // days between identical phases
// Reference new moon: 2000-01-06 18:14 UTC (Julian date 2451550.1).
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0)

// Phase "age" in days since the last new moon (0 .. 29.53).
export function moonAge(date = new Date()) {
  const days = (date.getTime() - REF_NEW_MOON) / 86400000
  let age = days % SYNODIC
  if (age < 0) age += SYNODIC
  return age
}

// Illuminated fraction of the disk (0 = new, 1 = full).
export function illumination(date = new Date()) {
  const phase = moonAge(date) / SYNODIC // 0..1
  return (1 - Math.cos(2 * Math.PI * phase)) / 2
}

const PHASES = [
  { name: 'New Moon',        max: 1.0 },
  { name: 'Waxing Crescent', max: 6.38 },
  { name: 'First Quarter',   max: 8.38 },
  { name: 'Waxing Gibbous',  max: 13.77 },
  { name: 'Full Moon',       max: 15.77 },
  { name: 'Waning Gibbous',  max: 21.15 },
  { name: 'Last Quarter',    max: 23.15 },
  { name: 'Waning Crescent', max: 28.5 },
  { name: 'New Moon',        max: 30 },
]

export function phaseName(date = new Date()) {
  const age = moonAge(date)
  return PHASES.find((p) => age < p.max).name
}

// Whether the moon is currently getting brighter (waxing) or dimmer (waning).
export function isWaxing(date = new Date()) {
  return moonAge(date) < SYNODIC / 2
}

// Days until the next full and next new moon.
export function nextEvents(date = new Date()) {
  const age = moonAge(date)
  const toNew = (SYNODIC - age)
  const half = SYNODIC / 2
  const toFull = age < half ? half - age : SYNODIC + half - age
  return {
    daysToFull: Math.round(toFull * 10) / 10,
    daysToNew: Math.round(toNew * 10) / 10,
  }
}

export function moonInfo(date = new Date()) {
  return {
    age: moonAge(date),
    illum: illumination(date),
    name: phaseName(date),
    waxing: isWaxing(date),
    ...nextEvents(date),
  }
}
