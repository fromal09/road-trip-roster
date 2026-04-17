import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Road Trip Roster',
  description: 'A daily sports trivia game. Follow the journey and guess the mystery player.',
  openGraph: {
    title: 'Road Trip Roster',
    description: 'Follow the career journey and guess the mystery player.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
