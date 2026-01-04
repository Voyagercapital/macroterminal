export type Signal = 'green' | 'red' | 'amber' | 'neutral'

export type Dashboard = {
  last_updated_utc: string
  risk_state: {
    score: number
    label: string
    drivers: Array<{ name: string; value: number | string; signal: Signal }>
  }
  regions: Array<{
    id: string
    name: string
    verdict: { cycle: string; inflation: string; financial: string }
    blocks: Array<{ title: string; items: Array<{ key: string; value: string; signal: Signal }> }>
  }>
  geo: {
    gpr: { value: number | string; signal: Signal }
    epu: { value: number | string; signal: Signal }
    hotspots: Array<{ name: string; signal: Signal }>
  }
}
