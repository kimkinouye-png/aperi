'use client'

import { useState } from 'react'
import type { ScenarioContext as SC, DimensionKey, DimensionScores, DimensionNotes } from '@/lib/types'
import { DIMENSIONS, computeOverall } from '@/lib/types'
import { autoScore } from '@/lib/autoscore'
import { supabase } from '@/lib/supabase'
import ScenarioContextComponent from './ScenarioContext'
import DimensionRow from './DimensionRow'
import OverallScore from './OverallScore'

const initScores = (): DimensionScores => ({ ae: null, op: null, rg: null, ns: null, sc: null })
const initNotes = (): DimensionNotes => ({ ae: '', op: '', rg: '', ns: '', sc: '' })

export default function ScoreView() {
  const [context, setContext] = useState<SC>({
    persona: 'Priya',
    severityTier: 2,
    emotionalFraming: 'Neutral',
    inputType: 'Rose response only',
    responseText: '',
  })
  const [scores, setScores] = useState<DimensionScores>(initScores())
  const [notes, setNotes] = useState<DimensionNotes>(initNotes())
  const [overallNotes, setOverallNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { total, result } = computeOverall(scores)

  const handleAutoScore = () => {
    const { scores: autoScores, notes: autoNotes } = autoScore(context.responseText)
    setScores(autoScores)
    setNotes(autoNotes)
  }

  const handleLogRun = async () => {
    if (total === null || !supabase) return
    setSaving(true)
    setSaved(false)

    const { error } = await supabase.from('scoring_runs').insert({
      persona: context.persona,
      severity_tier: context.severityTier,
      emotional_framing: context.emotionalFraming,
      input_type: context.inputType,
      response_text: context.responseText,
      score_ae: scores.ae,
      score_op: scores.op,
      score_rg: scores.rg,
      score_ns: scores.ns,
      score_sc: scores.sc,
      note_ae: notes.ae,
      note_op: notes.op,
      note_rg: notes.rg,
      note_ns: notes.ns,
      note_sc: notes.sc,
      overall_score: total,
      overall_notes: overallNotes,
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
    setContext({ persona: 'Priya', severityTier: 2, emotionalFraming: 'Neutral', inputType: 'Rose response only', responseText: '' })
    setScores(initScores())
    setNotes(initNotes())
    setOverallNotes('')
    setSaved(false)
  }

  return (
    <div>
      {/* Rose module: scenario context */}
      <ScenarioContextComponent context={context} onChange={u => setContext(prev => ({ ...prev, ...u }))} />

      {/* Scoring core */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: 20,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Scoring Dimensions
          </span>
          <button
            onClick={handleAutoScore}
            disabled={!context.responseText.trim()}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 500,
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'transparent',
              color: context.responseText.trim() ? 'var(--accent)' : 'var(--text-muted)',
              opacity: context.responseText.trim() ? 1 : 0.5,
              transition: 'all 0.15s',
            }}
          >
            Auto-score
          </button>
        </div>

        {DIMENSIONS.map(dim => (
          <DimensionRow
            key={dim.key}
            dimension={dim}
            score={scores[dim.key]}
            note={notes[dim.key]}
            onScoreChange={val => setScores(prev => ({ ...prev, [dim.key]: val }))}
            onNoteChange={val => setNotes(prev => ({ ...prev, [dim.key]: val }))}
          />
        ))}
      </div>

      {/* Overall */}
      <OverallScore total={total} result={result} />

      {/* Overall notes */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: 20,
      }}>
        <label style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 6,
        }}>
          Overall Notes
        </label>
        <textarea
          value={overallNotes}
          onChange={e => setOverallNotes(e.target.value)}
          placeholder="Any overall observations about this response..."
          style={{
            width: '100%',
            minHeight: 70,
            padding: '8px 10px',
            fontSize: 13,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'transparent',
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          onClick={handleReset}
          style={{
            padding: '9px 20px',
            fontSize: 13,
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
            padding: '9px 24px',
            fontSize: 13,
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
    </div>
  )
}
