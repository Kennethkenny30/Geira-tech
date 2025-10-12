"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function RetractableHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Header contracts after scrolling past hero (approximately 100vh)
      if (currentScrollY > window.innerHeight * 0.8) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      setLastScrollY(currentScrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Update CSS variables for mouse-reactive background
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      document.documentElement.style.setProperty("--mouse-x", `${x}%`)
      document.documentElement.style.setProperty("--mouse-y", `${y}%`)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [lastScrollY])

  const navItems = [
    { label: "Accueil", href: "#hero" },
    { label: "À propos", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projets", href: "#projects" },
    { label: "Processus", href: "#process" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out",
        isScrolled
          ? "w-[90%] max-w-5xl mt-4 rounded-2xl bg-card/80 backdrop-blur-xl border border-geira-cyan/30 shadow-2xl shadow-geira-cyan/10"
          : "w-full mt-0 rounded-none bg-transparent backdrop-blur-md border-b border-geira-cyan/10"
      )}
    >
      <nav
        className={cn(
          "flex items-center justify-between transition-all duration-500",
          isScrolled ? "px-6 py-3" : "px-8 py-6 container mx-auto"
        )}
      >
        {/* Logo avec image réelle */}
        <Link href="#hero" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/logo-geira-gradient.png"
              alt="Geira Tech Logo"
              width={isScrolled ? 36 : 48}
              height={isScrolled ? 36 : 48}
              className="transition-all duration-500 group-hover:scale-110 object-contain"
              priority
            />
            <div className="absolute inset-0 bg-geira-cyan/20 blur-xl group-hover:bg-geira-cyan/40 transition-all duration-300 -z-10 rounded-lg" />
          </div>
          <div className="flex flex-col">
            <span
              className={cn(
                "font-bold text-foreground transition-all duration-500 bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent",
                isScrolled ? "text-lg" : "text-2xl"
              )}
            >
              Geira Tech
            </span>
            {!isScrolled && (
              <span className="text-xs text-geira-cyan/70">Innovation & Excellence</span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-muted-foreground hover:text-geira-cyan transition-colors duration-300 relative group rounded-lg",
                isScrolled ? "text-sm" : "text-base"
              )}
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-geira-cyan to-geira-blue group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>

        {/* CTA Button and Mobile Menu */}
        <div className="flex items-center gap-3">
          <Button
            size={isScrolled ? "sm" : "default"}
            className="hidden sm:inline-flex bg-gradient-to-r from-geira-cyan to-geira-blue hover:shadow-lg hover:shadow-geira-cyan/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-geira-cyan/20 text-black font-semibold"
          >
            Devis gratuit
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-geira-cyan/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-geira-cyan/20 bg-card/95 backdrop-blur-xl">
          <div className="flex flex-col gap-2 p-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-geira-cyan transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-geira-cyan/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button className="mt-4 w-full bg-gradient-to-r from-geira-cyan to-geira-blue hover:opacity-90 transition-all duration-300 text-black font-semibold">
              Devis gratuit
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}