import type { Dashboard } from './types'

const DEFAULT_GEO: Dashboard['geo'] = {
  gpr: { value: '—', signal: 'neutral' },
  epu: { value: '—', signal: 'neutral' },
  hotspots: [],
}

export async function fetchDashboard(signal?: AbortSignal): Promise<Dashboard> {
  const res = await fetch('./data/dashboard.json', { cache: 'no-store', signal })
  if (!res.ok) throw new Error('Failed to load dashboard')

  const raw = (await res.json()) as Partial<Dashboard>

  // Ensure required blocks exist so the UI never crashes on missing data.
  return {
    ...(raw as Dashboard),
    geo: raw.geo ?? DEFAULT_GEO,
    risk_state: raw.risk_state ?? { score: 50, label: 'Neutral', drivers: [] },
    regions: raw.regions ?? [],
    last_updated_utc: raw.last_updated_utc ?? new Date().toISOString(),
  }
}
