import type { Metadata } from 'next'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import './globals.css'
import ThemeRegistry from '@/components/providers/ThemeRegistry'

export const metadata: Metadata = {
  title: 'Orbyt',
  description: 'Stay in orbit. Build the web.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}
