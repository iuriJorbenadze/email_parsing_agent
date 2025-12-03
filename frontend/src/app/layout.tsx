import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Sidebar } from '@/components/layout/Sidebar'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Email Parsing Agent',
  description: 'Parse commercial offer emails into structured data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans bg-background text-text-primary antialiased`}>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}


