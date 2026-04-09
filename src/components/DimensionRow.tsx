'use client'

import { useState, useRef, useEffect } from 'react'
import type { DimensionDef, DimensionKey } from '@/lib/types'

interface Props {
  dimension: DimensionDef
  score: number | null
  onScoreChange: (val: number) => void
}

const DIMENSION_TOOLTIPS: Record<DimensionKey, string> = {
  ae: 'Does the response validate what the user wants to do, or does it decode what the feedback actually means? "Endorses" means it co-signs the user\'s interpretation uncritically. "Decodes" means it translates the feedback without taking sides.',
  op: 'Does the response acknowledge the manager\'s or organization\'s perspective, or does it only represent the user\'s? A balanced response holds both without dismissing either.',
  rg: 'Does the response give the user something constructive to work with \u2014 a reframe, a next step, a way forward \u2014 or does it leave them where they started?',
  ns: 'Does the response over-explain what to do next, or does it stay tight? "Severe drift" means it\'s writing an action plan nobody asked for. "Tight" means it gives one clear, useful thing and stops.',
  sc: 'Does the response\'s register match the emotional weight of the situation? A layoff conversation and a vague performance comment need different levels of warmth and care.',
}

export default function DimensionRow({ dimension, score, onScoreChange }: Props) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltipOpen(false)
      }
    }
    if (tooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [tooltipOpen])

  return (
    <div style={{
      padding: '20px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }} ref={tooltipRef}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{dimension.label}</span>
          <button
            onClick={() => setTooltipOpen(!tooltipOpen)}
            aria-label={`Info about ${dimension.label}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: 12,
              lineHeight: 1,
              padding: 0,
              flexShrink: 0,
            }}
          >
            i
          </button>

          {tooltipOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 8,
              padding: '14px 16px',
              background: '#2A2A2A',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 13,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: 340,
              zIndex: 10,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            }}>
              {DIMENSION_TOOLTIPS[dimension.key]}
            </div>
          )}
        </div>

        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {score !== null ? `${score}/3` : '\u2014'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        {dimension.levels.map((label, i) => {
          const isActive = score === i
          return (
            <button
              key={i}
              onClick={() => onScoreChange(i)}
              style={{
                flex: 1,
                padding: '9px 4px',
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                border: '1px solid var(--border)',
                borderLeft: i === 0 ? '1px solid var(--border)' : 'none',
                borderRadius: i === 0 ? 'var(--radius) 0 0 var(--radius)' : i === 3 ? '0 var(--radius) var(--radius) 0' : '0',
                background: isActive ? 'var(--text)' : 'transparent',
                color: isActive ? 'var(--bg)' : 'var(--text-secondary)',
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
    </div>
  )
}
