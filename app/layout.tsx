import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { AnalyticsProvider } from "@/components/analytics-provider"

const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Geira Tech - Solutions digitales, IT & Énergie",
  description:
    "Geira Tech propose des solutions innovantes en design graphique, développement web & mobile, automatisation, maintenance informatique, panneaux solaires et sécurité.",
  keywords: [
    "Geira Tech",
    "solutions digitales",
    "développement web",
    "IT",
    "énergie",
    "automatisation",
    "design graphique",
  ],
  authors: [{ name: "Geira Tech" }],
  openGraph: {
    title: "Geira Tech - Solutions digitales, IT & Énergie",
    description: "Solutions innovantes en design, développement, IT et énergie",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} font-sans antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AnalyticsProvider>
            <div className="relative min-h-screen">{children}</div>
          </AnalyticsProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
