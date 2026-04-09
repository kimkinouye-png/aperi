'use client'

import { useState } from 'react'
import type { DimensionKey, DimensionScores } from '@/lib/types'
import { DIMENSIONS, computeOverall } from '@/lib/types'
import { autoScore } from '@/lib/autoscore'
import { supabase } from '@/lib/supabase'
import DimensionRow from './DimensionRow'
import OverallScore from './OverallScore'

const initScores = (): DimensionScores => ({ ae: null, op: null, rg: null, ns: null, sc: null })

export default function ScoreView() {
  const [responseText, setResponseText] = useState('')
  const [contextExpanded, setContextExpanded] = useState(false)
  const [contextNote, setContextNote] = useState('')
  const [scores, setScores] = useState<DimensionScores>(initScores())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [scored, setScored] = useState(false)

  const { total, result } = computeOverall(scores)

  const handleScore = () => {
    if (!responseText.trim()) return
    const { scores: autoScores } = autoScore(responseText)
    setScores(autoScores)
    setScored(true)
  }

  const handleLogRun = async () => {
    if (total === null || !supabase) return
    setSaving(true)
    setSaved(false)

    const { error } = await supabase.from('scoring_runs').insert({
      persona: 'N/A',
      severity_tier: 2,
      emotional_framing: 'Neutral',
      input_type: 'Rose response only',
      response_text: responseText,
      score_ae: scores.ae,
      score_op: scores.op,
      score_rg: scores.rg,
      score_ns: scores.ns,
      score_sc: scores.sc,
      note_ae: '',
      note_op: '',
      note_rg: '',
      note_ns: '',
      note_sc: '',
      overall_score: total,
      overall_notes: contextNote,
    })

    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } else {
      alert('Failed to save: ' + error.message)
    }
  }

  const handleReset = () => {
    setResponseText('')
    setContextNote('')
    setScores(initScores())
    setSaved(false)
    setScored(false)
    setContextExpanded(false)
  }

  return (
    <div>
      {/* Response text input — full width, no card wrapper */}
      <textarea
        value={responseText}
        onChange={e => {
          setResponseText(e.target.value)
          if (scored) {
            setScored(false)
            setScores(initScores())
          }
        }}
        placeholder="Paste the response or conversation here..."
        style={{
          width: '100%',
          minHeight: 160,
          padding: '16px 18px',
          fontSize: 16,
          lineHeight: 1.6,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          background: 'transparent',
          color: 'var(--text)',
          resize: 'vertical',
          marginBottom: 12,
        }}
      />

      {/* Optional context expander */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setContextExpanded(!contextExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 0',
            fontSize: 14,
            fontWeight: 500,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            transition: 'color 0.15s',
          }}
        >
          <span style={{
            display: 'inline-block',
            transform: contextExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            fontSize: 12,
          }}>
            ▾
          </span>
          Optional context
        </button>

        {contextExpanded && (
          <textarea
            value={contextNote}
            onChange={e => setContextNote(e.target.value)}
            placeholder="Add any context about this response — who it's for, what feedback was given, etc."
            style={{
              width: '100%',
              minHeight: 80,
              padding: '12px 14px',
              fontSize: 14,
              lineHeight: 1.6,
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--card-bg)',
              color: 'var(--text)',
              resize: 'vertical',
              marginTop: 8,
            }}
          />
        )}
      </div>

      {/* Score button */}
      <button
        onClick={handleScore}
        disabled={!responseText.trim()}
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: 16,
          fontWeight: 600,
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          background: responseText.trim() ? 'var(--accent)' : 'var(--border)',
          color: responseText.trim() ? '#fff' : 'var(--text-muted)',
          opacity: responseText.trim() ? 1 : 0.6,
          transition: 'all 0.2s',
          marginBottom: 32,
          letterSpacing: '0.01em',
        }}
      >
        Score
      </button>

      {/* Scoring dimensions */}
      {scored && (
        <>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: 24,
          }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: 8,
            }}>
              Scoring Dimensions
            </span>

            {DIMENSIONS.map(dim => (
              <DimensionRow
                key={dim.key}
                dimension={dim}
                score={scores[dim.key]}
                onScoreChange={val => setScores(prev => ({ ...prev, [dim.key]: val }))}
              />
            ))}
          </div>

          {/* Overall result — revealed after all 5 scored */}
          <OverallScore total={total} result={result} scores={scores} responseText={responseText} />

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button
              onClick={handleReset}
              style={{
                padding: '11px 24px',
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'transparent',
                color: 'var(--text-secondary)',
              }}
            >
              Reset
            </button>
            <button
              onClick={handleLogRun}
              disabled={total === null || saving}
              style={{
                padding: '11px 28px',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--radius)',
                background: saved ? 'var(--pass)' : total !== null ? 'var(--accent)' : 'var(--border)',
                color: '#fff',
                opacity: total === null ? 0.4 : 1,
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Saving...' : saved ? 'Logged' : 'Log Run'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
