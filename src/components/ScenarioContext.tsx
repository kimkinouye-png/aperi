'use client'

import type { ScenarioContext as SC, Persona, SeverityTier, EmotionalFraming, InputType } from '@/lib/types'
import { SEVERITY_LABELS } from '@/lib/types'

interface Props {
  context: SC
  onChange: (updates: Partial<SC>) => void
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  background: 'var(--card-bg)',
  fontSize: 13,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 4,
}

export default function ScenarioContext({ context, onChange }: Props) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      marginBottom: 20,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--accent)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 14,
      }}>
        Rose Module — Scenario Context
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Persona</label>
          <select
            style={selectStyle}
            value={context.persona}
            onChange={e => onChange({ persona: e.target.value as Persona })}
          >
            <option>Priya</option>
            <option>Dara</option>
            <option>Marcus</option>
            <option>Custom</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Severity Tier</label>
          <select
            style={selectStyle}
            value={context.severityTier}
            onChange={e => onChange({ severityTier: Number(e.target.value) as SeverityTier })}
          >
            {([1, 2, 3, 4] as SeverityTier[]).map(t => (
              <option key={t} value={t}>{SEVERITY_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Emotional Framing</label>
          <select
            style={selectStyle}
            value={context.emotionalFraming}
            onChange={e => onChange({ emotionalFraming: e.target.value as EmotionalFraming })}
          >
            <option>Certain</option>
            <option>Uncertain</option>
            <option>Distressed</option>
            <option>Neutral</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Input Type</label>
          <select
            style={selectStyle}
            value={context.inputType}
            onChange={e => onChange({ inputType: e.target.value as InputType })}
          >
            <option>Rose response only</option>
            <option>Full conversation</option>
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Response / Conversation</label>
        <textarea
          value={context.responseText}
          onChange={e => onChange({ responseText: e.target.value })}
          placeholder="Paste the response or conversation here..."
          style={{
            width: '100%',
            minHeight: 120,
            padding: '10px 12px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--card-bg)',
            fontSize: 13,
            lineHeight: 1.6,
            resize: 'vertical',
          }}
        />
      </div>
    </div>
  )
}
