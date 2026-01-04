import React from 'react'
import type { Dashboard } from '../lib/types'
import SignalPill from './SignalPill'

export default function RegionPanel({ region }: { region: Dashboard['regions'][number] }) {
  return (
    <div className="stack">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="h1">{region.name}</div>
            <div className="small">Cycle: <b>{region.verdict.cycle}</b> • Inflation: <b>{region.verdict.inflation}</b> • Financial: <b>{region.verdict.financial}</b></div>
          </div>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <SignalPill signal="neutral" text={region.id} />
          </div>
        </div>
      </div>

      <div className="grid">
        {region.blocks.map((b) => (
          <div className="card" key={b.title}>
            <div className="h2">{b.title}</div>
            <div className="table">
              {b.items.map((it) => (
                <div className="tr" key={it.key}>
                  <div className="td key">{it.key}</div>
                  <div className="td val">{it.value}</div>
                  <div className="td" style={{ textAlign: 'right' }}>
                    <SignalPill signal={it.signal} text={it.signal === 'neutral' ? '—' : it.signal.toUpperCase()} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
