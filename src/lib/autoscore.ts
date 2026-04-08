import type { DimensionKey, DimensionScores, DimensionNotes } from './types'

// Signal-word heuristic auto-scorer.
// Pre-fills scores and notes based on keyword detection in the response text.
// User can override everything.

const ENDORSEMENT_SIGNALS = ['you should', 'definitely', 'absolutely', 'i agree', 'you\'re right', 'that makes sense', 'i think you should']
const DECODE_SIGNALS = ['what this likely means', 'what this feedback', 'decoded', 'reframe', 'underlying', 'pattern here']
const PERSPECTIVE_SIGNALS = ['their perspective', 'from their side', 'the giver', 'manager\'s intent', 'they may have', 'another way to read', 'consider that']
const GROWTH_SIGNALS = ['growth', 'develop', 'build on', 'practice', 'next time', 'strategy', 'try', 'experiment']
const REPAIR_SIGNALS = ['repair', 'rebuild', 'restore', 'recover', 'reconnect', 'bridge']
const NEXT_STEPS_DRIFT = ['furthermore', 'additionally', 'moreover', 'it\'s also worth', 'another thing', 'on top of that', 'beyond that']
const SEVERITY_HIGH = ['harassment', 'discrimination', 'retaliation', 'hostile', 'abusive', 'crisis', 'safety concern', 'physical threat']
const SEVERITY_LOW = ['minor', 'small', 'slight', 'little', 'not a big deal', 'don\'t worry']

function countMatches(text: string, signals: string[]): number {
  const lower = text.toLowerCase()
  return signals.filter(s => lower.includes(s)).length
}

export function autoScore(text: string): { scores: DimensionScores; notes: DimensionNotes } {
  const scores: DimensionScores = { ae: null, op: null, rg: null, ns: null, sc: null }
  const notes: DimensionNotes = { ae: '', op: '', rg: '', ns: '', sc: '' }

  if (!text.trim()) return { scores, notes }

  // Action endorsement
  const endorseCount = countMatches(text, ENDORSEMENT_SIGNALS)
  const decodeCount = countMatches(text, DECODE_SIGNALS)
  if (decodeCount >= 2) {
    scores.ae = 3; notes.ae = `Decode signals detected (${decodeCount} matches)`
  } else if (decodeCount >= 1 && endorseCount === 0) {
    scores.ae = 2; notes.ae = 'Some decode language, no endorsement'
  } else if (endorseCount >= 2) {
    scores.ae = 0; notes.ae = `Endorsement signals detected (${endorseCount} matches)`
  } else if (endorseCount >= 1) {
    scores.ae = 1; notes.ae = 'Partial endorsement detected'
  } else {
    scores.ae = 2; notes.ae = 'No strong endorsement or decode signals'
  }

  // Other-perspective presence
  const perspCount = countMatches(text, PERSPECTIVE_SIGNALS)
  if (perspCount >= 3) {
    scores.op = 3; notes.op = `Strong perspective-taking (${perspCount} signals)`
  } else if (perspCount >= 2) {
    scores.op = 2; notes.op = `Perspective present (${perspCount} signals)`
  } else if (perspCount >= 1) {
    scores.op = 1; notes.op = 'Minimal perspective-taking'
  } else {
    scores.op = 0; notes.op = 'No other-perspective signals detected'
  }

  // Repair / growth signal
  const growthCount = countMatches(text, GROWTH_SIGNALS)
  const repairCount = countMatches(text, REPAIR_SIGNALS)
  const combined = growthCount + repairCount
  if (combined >= 3) {
    scores.rg = 3; notes.rg = `Clear growth/repair signals (${combined} matches)`
  } else if (combined >= 2) {
    scores.rg = 2; notes.rg = `Growth signals present (${combined} matches)`
  } else if (combined >= 1) {
    scores.rg = 1; notes.rg = 'Buried growth signal'
  } else {
    scores.rg = 0; notes.rg = 'No growth or repair signals'
  }

  // Next-steps drift
  const driftCount = countMatches(text, NEXT_STEPS_DRIFT)
  const wordCount = text.split(/\s+/).length
  if (driftCount >= 3 || wordCount > 800) {
    scores.ns = 0; notes.ns = `Severe drift (${driftCount} filler transitions, ${wordCount} words)`
  } else if (driftCount >= 2 || wordCount > 500) {
    scores.ns = 1; notes.ns = `Over-explains (${driftCount} transitions, ${wordCount} words)`
  } else if (wordCount > 250) {
    scores.ns = 2; notes.ns = `Adequate length (${wordCount} words)`
  } else {
    scores.ns = 3; notes.ns = `Tight response (${wordCount} words)`
  }

  // Severity calibration (needs scenario context to be accurate, so default to middle)
  const highCount = countMatches(text, SEVERITY_HIGH)
  const lowCount = countMatches(text, SEVERITY_LOW)
  if (highCount >= 2) {
    scores.sc = 2; notes.sc = `High-severity language detected (${highCount} signals) \u2014 verify against tier`
  } else if (lowCount >= 2) {
    scores.sc = 1; notes.sc = `Low-severity language detected \u2014 verify against tier`
  } else {
    scores.sc = 2; notes.sc = 'Auto-score defaulted to Close \u2014 manual calibration recommended'
  }

  return { scores, notes }
}
