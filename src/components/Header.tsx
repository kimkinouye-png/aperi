'use client'

import type { AppView } from '@/lib/types'

interface Props {
  view: AppView
  onViewChange: (v: AppView) => void
}

export default function Header({ view, onViewChange }: Props) {
  const tab = (v: AppView) => ({
    padding: '8px 20px',
    fontSize: 14,
    fontWeight: 500 as const,
    border: 'none',
    borderRadius: 'var(--radius)',
    background: view === v ? 'rgba(240, 237, 230, 0.1)' : 'transparent',
    color: view === v ? 'var(--text)' : 'var(--text-muted)',
    transition: 'all 0.15s',
  })

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 780,
      margin: '0 auto',
    }}>
      <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text)' }}>
        Aperi
      </span>
      <nav style={{ display: 'flex', gap: 6 }}>
        <button style={tab('score')} onClick={() => onViewChange('score')}>Score</button>
        <button style={tab('history')} onClick={() => onViewChange('history')}>History</button>
      </nav>
    </header>
  )
}
