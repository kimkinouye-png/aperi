'use client'

import type { OverallResult } from '@/lib/types'

interface Props {
  total: number | null
  result: OverallResult
}

const resultColor: Record<string, string> = {
  Pass: 'var(--pass)',
  Borderline: 'var(--borderline)',
  Fail: 'var(--fail)',
}

export default function OverallScore({ total, result }: Props) {
  if (total === null || result === null) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: 'var(--text-muted)',
        fontSize: 13,
      }}>
        Score all five dimensions to see the overall result.
      </div>
    )
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '24px 20px',
      background: 'var(--card-bg)',
      border: `2px solid ${resultColor[result]}`,
      borderRadius: 'var(--radius-lg)',
      marginBottom: 16,
    }}>
      <div style={{
        fontSize: 36,
        fontWeight: 700,
        color: resultColor[result],
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {total}/15
      </div>
      <div style={{
        fontSize: 14,
        fontWeight: 600,
        color: resultColor[result],
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {result}
      </div>
      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        marginTop: 4,
      }}>
        {result === 'Pass' ? '11\u201315' : result === 'Borderline' ? '8\u201310' : '0\u20137'}
      </div>
    </div>
  )
}
