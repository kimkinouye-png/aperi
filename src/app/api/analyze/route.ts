import { NextResponse } from 'next/server'

const DIMENSION_LABELS: Record<string, string> = {
  ae: 'Action endorsement',
  op: 'Other-perspective presence',
  rg: 'Repair / growth signal',
  ns: 'Next-steps drift',
  sc: 'Tone calibration',
}

const LEVEL_LABELS: Record<string, string[]> = {
  ae: ['Endorses', 'Partial', 'Neutral', 'Decodes'],
  op: ['Absent', 'Minimal', 'Present', 'Balanced'],
  rg: ['Absent', 'Buried', 'Present', 'Clear'],
  ns: ['Severe drift', 'Over-explains', 'Adequate', 'Tight'],
  sc: ['Wrong tier', 'Off', 'Close', 'Matched'],
}

export async function POST(request: Request) {
  try {
    const { scores, total, result } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        analysis: 'API key not configured. Add ANTHROPIC_API_KEY to your environment variables.',
      })
    }

    const scoreBreakdown = Object.entries(scores)
      .map(([key, val]) => {
        const label = DIMENSION_LABELS[key] || key
        const level = LEVEL_LABELS[key]?.[val as number] || String(val)
        return `${label}: ${val}/3 (${level})`
      })
      .join('\n')

    const prompt = `You are analyzing scores from a response quality rubric for an AI career coaching tool. The rubric measures five dimensions of response quality, each scored 0-3.

Here are the scores:
${scoreBreakdown}

Overall: ${total}/15 — ${result}

Write a 2-3 sentence plain-language analysis of what these scores mean together. Be factual and direct. Reference the dimension names and what the scores indicate about the response's strengths and weaknesses. Do not give coaching advice or suggest improvements. Do not use em dashes.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return NextResponse.json({ analysis: 'Analysis unavailable.' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || 'Analysis unavailable.'

    return NextResponse.json({ analysis: text })
  } catch (err) {
    console.error('Analysis error:', err)
    return NextResponse.json({ analysis: 'Analysis unavailable.' })
  }
}
