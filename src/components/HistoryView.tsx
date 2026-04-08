'use client'

import { useEffect, useState } from 'react'
import type { ScoringRun } from '@/lib/types'
import { SEVERITY_LABELS } from '@/lib/types'
import type { SeverityTier } from '@/lib/types'
import { supabase } from '@/lib/supabase'

function resultFor(score: number): { label: string; color: string } {
  if (score >= 11) return { label: 'Pass', color: 'var(--pass)' }
  if (score >= 8) return { label: 'Borderline', color: 'var(--borderline)' }
  return { label: 'Fail', color: 'var(--fail)' }
}

export default function HistoryView() {
  const [runs, setRuns] = useState<ScoringRun[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('scoring_runs')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setRuns(data as ScoringRun[])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text-muted)', fontSize: 13 }}>
        Loading runs...
      </div>
    )
  }

  if (!supabase) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text-muted)', fontSize: 13 }}>
        Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.
      </div>
    )
  }

  if (runs.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text-muted)', fontSize: 13 }}>
        No scored runs yet. Score a response first.
      </div>
    )
  }

  return (
    <div>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 12,
      }}>
        Scored Runs ({runs.length})
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {runs.map(run => {
          const { label, color } = resultFor(run.overall_score)
          const tierLabel = SEVERITY_LABELS[run.severity_tier as SeverityTier] || `Tier ${run.severity_tier}`
          const date = new Date(run.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
          })

          return (
            <div key={run.id} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                {/* Score badge */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius)',
                  background: `${color}12`,
                  border: `1.5px solid ${color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color, lineHeight: 1 }}>
                    {run.overall_score}
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 600, color, textTransform: 'uppercase' }}>
                    {label}
                  </span>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{run.persona}</span>
                    <span style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      borderRadius: 20,
                      background: 'var(--accent-light)',
                      color: 'var(--accent)',
                      fontWeight: 500,
                    }}>
                      {tierLabel}
                    </span>
                    <span style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      borderRadius: 20,
                      background: 'rgba(28,27,46,0.05)',
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                    }}>
                      {run.emotional_framing}
                    </span>
                  </div>
                  {run.overall_notes && (
                    <p style={{
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      marginTop: 3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {run.overall_notes}
                    </p>
                  )}
                </div>
              </div>

              <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {date}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
