import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Aurith Recruit - AI-Powered Recruitment',
  description: 'Analyze CVs and rank candidates with AI. Aurith Recruit helps you hire the best talent faster.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="/analytics-tracker.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (typeof window !== 'undefined' && window.WebsiteTracker) {
              window.WebsiteTracker.init({
                trackingUrl: '/api/track',
                website: 'aurith-recruit.com',
                enabled: true,
                trackPageView: true,
                debug: false
              });
            }
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
