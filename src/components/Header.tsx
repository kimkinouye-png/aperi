'use client'

import type { AppView } from '@/lib/types'

interface Props {
  view: AppView
  onViewChange: (v: AppView) => void
}

export default function Header({ view, onViewChange }: Props) {
  const tab = (v: AppView, label: string) => ({
    padding: '6px 18px',
    fontSize: 13,
    fontWeight: 500 as const,
    border: 'none',
    borderRadius: 'var(--radius)',
    background: view === v ? 'var(--text)' : 'transparent',
    color: view === v ? '#fff' : 'var(--text-secondary)',
    transition: 'all 0.15s',
  })

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 780,
      margin: '0 auto',
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
        Aperi
      </span>
      <nav style={{ display: 'flex', gap: 6 }}>
        <button style={tab('score', 'Score')} onClick={() => onViewChange('score')}>Score</button>
        <button style={tab('history', 'History')} onClick={() => onViewChange('history')}>History</button>
      </nav>
    </header>
  )
}
