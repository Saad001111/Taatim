// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'مؤسسة تعتيم - للستائر والتصميم',
  description: 'نحول أحلامك إلى واقع جميل مع أجود أنواع الستائر والتصميمات العصرية في الرياض',
  keywords: 'ستائر, تصميم, الرياض, خياطة, تركيب, ديكور, منزل',
  authors: [{ name: 'مؤسسة تعتيم' }],
  robots: 'index, follow',
  openGraph: {
    title: 'مؤسسة تعتيم - للستائر والتصميم',
    description: 'نحول أحلامك إلى واقع جميل مع أجود أنواع الستائر والتصميمات العصرية في الرياض',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'مؤسسة تعتيم',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مؤسسة تعتيم - للستائر والتصميم',
    description: 'نحول أحلامك إلى واقع جميل مع أجود أنواع الستائر والتصميمات العصرية في الرياض',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e3a8a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className="font-normal antialiased">
        {children}
      </body>
    </html>
  )
}