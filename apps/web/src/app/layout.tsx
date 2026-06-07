import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Iloilo Explorer — Discover the Heart of the Philippines',
  description: 'Your comprehensive guide to Iloilo City — jeepney routes, tourist attractions, local cuisine, and cultural heritage.',
  keywords: 'Iloilo, Philippines, tourism, jeepney, food, attractions, travel guide',
  openGraph: {
    title: 'Iloilo Explorer',
    description: 'Discover the Heart of the Philippines',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
