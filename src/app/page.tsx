'use client'

import { useState } from 'react'
import type { AppView } from '@/lib/types'
import Header from '@/components/Header'
import ScoreView from '@/components/ScoreView'
import HistoryView from '@/components/HistoryView'

export default function Home() {
  const [view, setView] = useState<AppView>('score')

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header view={view} onViewChange={setView} />
      <main style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px 100px' }}>
        {view === 'score' ? <ScoreView /> : <HistoryView />}
      </main>
    </div>
  )
}
