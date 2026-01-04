import React, { useEffect, useMemo, useState } from 'react'
import type { Dashboard } from './lib/types'
import { fetchDashboard } from './lib/api'
import { fmtUtc, riskLabel } from './lib/utils'
import RiskGauge from './components/RiskGauge'
import SignalPill from './components/SignalPill'
import RegionPanel from './components/RegionPanel'

type Tab = 'OVERVIEW' | 'GEO' | string

export default function App() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [tab, setTab] = useState<Tab>('OVERVIEW')

  async function load() {
    setLoading(true)
    setError(null)
    const ac = new AbortController()
    try {
      const d = await fetchDashboard(ac.signal)
      setData(d)
      setTab((t) => (t === 'OVERVIEW' || t === 'GEO') ? t : t)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load')
    } finally {
      setLoading(false)
    }
    return () => ac.abort()
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tabs = useMemo(() => {
    const regionTabs = (data?.regions ?? []).map((r) => r.id)
    return ['OVERVIEW', ...regionTabs, 'GEO'] as Tab[]
  }, [data])

  const selectedRegion = useMemo(() => (data?.regions ?? []).find((r) => r.id === tab) ?? null, [data, tab])

  const riskState = data ? {
    score: data.risk_state.score,
    label: data.risk_state.label || riskLabel(data.risk_state.score)
  } : null

  return (
    <div className="container">
      <header>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: 0.6 }}>MACRO TERMINAL</div>
            <div className="small">
              Last update (UTC): {data ? fmtUtc(data.last_updated_utc) : '—'}
            </div>
          </div>
          <div className="row" style={{ gap: 10, alignItems: 'center' }}>
            {riskState && (
              <SignalPill
                signal={riskState.score >= 65 ? 'red' : riskState.score <= 35 ? 'green' : 'neutral'}
                text={`${riskState.label} • ${riskState.score}`}
              />
            )}
            <button className="btn" onClick={() => load()} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Macro terminal tabs">
          {tabs.map((t) => (
            <button
              key={t}
              className={t === tab ? 'tab active' : 'tab'}
              onClick={() => setTab(t)}
            >
              {t === 'OVERVIEW' ? 'Overview' : t === 'GEO' ? 'Geo' : t}
            </button>
          ))}
        </div>
      </header>

      {error && <div className="card" style={{ borderColor: 'rgba(255,92,108,0.35)' }}>{error}</div>}

      {tab === 'OVERVIEW' && (
        <div className="stack">
          <div className="grid">
            <div className="card">
              <div className="h2">Global Risk Pulse</div>
              {data ? (
                <>
                  <RiskGauge score={data.risk_state.score} />
                  <div style={{ marginTop: 12 }}>
                    <div className="small" style={{ marginBottom: 6 }}>Drivers</div>
                    <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                      {data.risk_state.drivers.map((d) => (
                        <SignalPill key={d.name} signal={d.signal} text={`${d.name}: ${d.value}`} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="small">Loading…</div>
              )}
            </div>

            <div className="card">
              <div className="h2">Geo & Policy Risk</div>
              {data ? (
                <>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <div className="small">GPR</div>
                    <SignalPill signal={data.geo.gpr.signal} text={`${data.geo.gpr.value}`} />
                  </div>
                  <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
                    <div className="small">EPU</div>
                    <SignalPill signal={data.geo.epu.signal} text={`${data.geo.epu.value}`} />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div className="small" style={{ marginBottom: 6 }}>Hotspots</div>
                    <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                      {data.geo.hotspots.map((h) => (
                        <SignalPill key={h.name} signal={h.signal} text={h.name} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="small">Loading…</div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="h2">Regions snapshot</div>
            {data ? (
              <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                {data.regions.map((r) => (
                  <button key={r.id} className="chip" onClick={() => setTab(r.id)}>
                    <div style={{ fontWeight: 700 }}>{r.id}</div>
                    <div className="small">{r.verdict.cycle} • {r.verdict.inflation}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="small">Loading…</div>
            )}
          </div>

          <footer>
            Data is refreshed by a GitHub Action and served from GitHub Pages. For fully real-time, breadth-of-market pricing you’d add a licensed feed.
          </footer>
        </div>
      )}

      {tab === 'GEO' && data && (
        <div className="stack">
          <div className="card">
            <div className="h1">Geopolitical & Policy Risk</div>
            <div className="small">This tab is driven by GPR/EPU + conflict intensity (ACLED) aggregates generated during the daily refresh.</div>
            <div style={{ marginTop: 12 }} className="row">
              <SignalPill signal={data.geo.gpr.signal} text={`GPR: ${data.geo.gpr.value}`} />
              <SignalPill signal={data.geo.epu.signal} text={`EPU: ${data.geo.epu.value}`} />
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="small" style={{ marginBottom: 6 }}>Hotspots</div>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                {data.geo.hotspots.map((h) => (
                  <SignalPill key={h.name} signal={h.signal} text={h.name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRegion && (
        <RegionPanel region={selectedRegion} />
      )}

      {!data && loading && (
        <div className="card"><div className="small">Loading dashboard…</div></div>
      )}
    </div>
  )
}
