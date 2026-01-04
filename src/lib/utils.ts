import type { Signal } from './types'

export function fmtUtc(iso: string) {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toUTCString()
}

export function signalClass(s: Signal) {
  switch (s) {
    case 'green': return 'pill green'
    case 'red': return 'pill red'
    case 'amber': return 'pill amber'
    default: return 'pill neutral'
  }
}

export function riskLabel(score: number) {
  if (score >= 65) return 'Risk-off'
  if (score <= 35) return 'Risk-on'
  return 'Neutral'
}
