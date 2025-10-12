"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ParallaxWrapperProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function ParallaxWrapper({ children, speed = 0.5, className = "" }: ParallaxWrapperProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleScroll = () => {
      const scrolled = window.scrollY
      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      const windowHeight = window.innerHeight

      // Only apply parallax when element is in viewport
      if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
        const yPos = (scrolled - elementTop) * speed
        element.style.transform = `translate3d(0, ${yPos}px, 0)`
      }
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={elementRef} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  )
}
