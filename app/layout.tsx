import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sai Pamula — Data / Systems / Engineering',
  description:
    'Sai Pamula is a data and integration engineer focused on enterprise integrations, data workflows, automation, and resilient systems.',
  applicationName: 'Sai Pamula Portfolio',
  openGraph: {
    title: 'Sai Pamula — Data / Systems / Engineering',
    description:
      'Connecting data. Engineering possibilities. Explore the work and thinking of Sai Pamula.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sai Pamula — Data / Systems / Engineering',
    description: 'Connecting data. Engineering possibilities.',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
