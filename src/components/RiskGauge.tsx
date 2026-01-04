import React from 'react'

export default function RiskGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score))
  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <div className="small">Risk score</div>
        <div className="small"><b>{pct}</b>/100</div>
      </div>
      <div className="gauge">
        <div className="gaugeFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
