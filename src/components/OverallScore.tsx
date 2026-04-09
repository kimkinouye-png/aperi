'use client'

import { useState, useEffect } from 'react'
import type { OverallResult, DimensionScores } from '@/lib/types'

interface Props {
  total: number | null
  result: OverallResult
  scores: DimensionScores
  responseText: string
}

const resultColor: Record<string, string> = {
  Pass: 'var(--pass)',
  Borderline: 'var(--borderline)',
  Fail: 'var(--fail)',
}

export default function OverallScore({ total, result, scores, responseText }: Props) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (total === null || result === null) {
      setAnalysis(null)
      return
    }

    let cancelled = false
    setAnalyzing(true)
    setAnalysis(null)

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores, total, result, responseText }),
    })
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setAnalysis(data.analysis || 'Unable to generate analysis.')
          setAnalyzing(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAnalysis('Analysis unavailable.')
          setAnalyzing(false)
        }
      })

    return () => { cancelled = true }
  }, [total, result, scores, responseText])

  if (total === null || result === null) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '24px',
        color: 'var(--text-muted)',
        fontSize: 14,
      }}>
        Score all five dimensions to see the overall result.
      </div>
    )
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '32px 24px',
      background: 'var(--card-bg)',
      border: `2px solid ${resultColor[result]}`,
      borderRadius: 'var(--radius-lg)',
      marginBottom: 20,
    }}>
      <div style={{
        fontSize: 42,
        fontWeight: 700,
        color: resultColor[result],
        lineHeight: 1,
        marginBottom: 6,
      }}>
        {total}/15
      </div>
      <div style={{
        fontSize: 15,
        fontWeight: 600,
        color: resultColor[result],
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 4,
      }}>
        {result}
      </div>
      <div style={{
        fontSize: 12,
        color: 'var(--text-muted)',
        marginBottom: 20,
      }}>
        {result === 'Pass' ? '11\u201315' : result === 'Borderline' ? '8\u201310' : '0\u20137'}
      </div>

      {/* AI Analysis */}
      <div style={{
        textAlign: 'left',
        borderTop: '1px solid var(--border)',
        paddingTop: 18,
        marginTop: 4,
      }}>
        {analyzing ? (
          <div style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}>
            Generating analysis...
          </div>
        ) : analysis ? (
          <p style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            {analysis}
          </p>
        ) : null}
      </div>
    </div>
  )
}
