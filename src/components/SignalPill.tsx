import React from 'react'
import type { Signal } from '../lib/types'
import { signalClass } from '../lib/utils'

export default function SignalPill({ signal, text }: { signal: Signal; text: string }) {
  return <span className={signalClass(signal)}>{text}</span>
}
