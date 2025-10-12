"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackPageView, trackScrollDepth } from "@/lib/analytics"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    trackPageView(pathname)

    // Track scroll depth
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      )

      if (scrollPercentage > maxScroll && scrollPercentage % 25 === 0) {
        maxScroll = scrollPercentage
        trackScrollDepth(scrollPercentage)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  return <>{children}</>
}
