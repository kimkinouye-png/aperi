'use client'

import type { DimensionDef } from '@/lib/types'

interface Props {
  dimension: DimensionDef
  score: number | null
  note: string
  onScoreChange: (val: number) => void
  onNoteChange: (val: string) => void
}

export default function DimensionRow({ dimension, score, note, onScoreChange, onNoteChange }: Props) {
  return (
    <div style={{
      padding: '16px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{dimension.label}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {score !== null ? `${score}/3` : '\u2014'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 8 }}>
        {dimension.levels.map((label, i) => {
          const isActive = score === i
          return (
            <button
              key={i}
              onClick={() => onScoreChange(i)}
              style={{
                flex: 1,
                padding: '7px 4px',
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                border: '1px solid var(--border)',
                borderLeft: i === 0 ? '1px solid var(--border)' : 'none',
                borderRadius: i === 0 ? 'var(--radius) 0 0 var(--radius)' : i === 3 ? '0 var(--radius) var(--radius) 0' : '0',
                background: isActive ? 'var(--text)' : 'var(--card-bg)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.12s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={`${i} \u2014 ${label}`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <input
        type="text"
        value={note}
        onChange={e => onNoteChange(e.target.value)}
        placeholder="Notes..."
        style={{
          width: '100%',
          padding: '6px 10px',
          fontSize: 12,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'transparent',
          color: 'var(--text-secondary)',
        }}
      />
    </div>
  )
}
