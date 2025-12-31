import type { Metadata } from 'next'
import { Share_Tech_Mono } from 'next/font/google'
import '@/styles/globals.css'
import '@/styles/terminal.css'
import '@/styles/animations.css'
import '@/styles/mobile.css'
import MatrixRain from '@/components/MatrixRain'

const mono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Who Am I Online - Digital Presence Analyzer',
  description: 'Advanced OSINT Analysis System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${mono.variable} terminal-container`}>
        <MatrixRain />
        <div className="scanlines"></div>
        <div className="crt-flicker">
          {children}
        </div>
      </body>
    </html>
  )
}

