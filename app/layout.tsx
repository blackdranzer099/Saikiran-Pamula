import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://saipamula.dev'),
  title: 'Sai Pamula — Data / Systems / Engineering',
  description: 'Sai Pamula builds enterprise integrations, data workflows, automation systems, and reliable engineering foundations.',
  keywords: ['Sai Pamula', 'data engineer', 'SnapLogic', 'Azure', 'Python', 'automation specialist'],
  alternates: { canonical: '/' },
  openGraph: { title: 'Sai Pamula — Data / Systems / Engineering', description: 'Building connections that move systems forward.', type: 'website', url: 'https://saipamula.dev' },
  twitter: { card: 'summary_large_image', title: 'Sai Pamula — Data / Systems / Engineering', description: 'Building connections that move systems forward.' },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
