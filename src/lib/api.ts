import type { Dashboard } from './types'

export async function fetchDashboard(signal?: AbortSignal): Promise<Dashboard> {
  const res = await fetch('./data/dashboard.json', { cache: 'no-store', signal })
  if (!res.ok) throw new Error('Failed to load dashboard')
  return res.json()
}
