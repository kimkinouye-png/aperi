import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aperi \u2014 Response Quality Scoring',
  description: 'Score AI responses against a sycophancy and quality rubric.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
