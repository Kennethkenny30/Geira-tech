"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { ThreeHeroScene } from "@/components/three-hero-scene"
import Image from "next/image"

export function HeroWithLoading() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-geira-cyan/40 to-geira-blue/40 animate-pulse" />

            <div className="relative w-40 h-40 animate-float">
              <Image
                src="/logo-geira-gradient.png"
                alt="Geira Tech"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Rotating rings */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
              <div className="w-full h-full rounded-full border-2 border-transparent border-t-geira-cyan border-r-geira-blue opacity-50" />
            </div>
            <div
              className="absolute inset-2 animate-spin"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            >
              <div className="w-full h-full rounded-full border-2 border-transparent border-b-geira-accent border-l-geira-cyan opacity-30" />
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-geira-cyan via-geira-accent to-geira-blue bg-clip-text text-transparent animate-pulse">
              Geira Tech
            </h2>
            <p className="text-sm text-muted-foreground">Chargement de l'expérience...</p>

            {/* Loading bar */}
            <div className="w-48 h-1 bg-card rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-geira-cyan to-geira-blue animate-loading-bar" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ThreeHeroScene />

      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-geira-cyan" />
            <span className="text-sm font-medium text-geira-cyan">Innovation & Excellence</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-balance leading-tight">
            Transformez vos idées en
            <br />
            <span className="bg-gradient-to-r from-geira-cyan via-geira-accent to-geira-blue bg-clip-text text-transparent">
              réalité digitale
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Solutions complètes en design, développement, IT et énergie pour propulser votre entreprise vers l'avenir
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-geira-cyan to-geira-blue hover:opacity-90 transition-all duration-300 shadow-lg shadow-geira-cyan/25 group text-black font-semibold"
            >
              Démarrer un projet
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-geira-cyan/50 hover:bg-geira-cyan/10 bg-transparent">
              Découvrir nos services
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-geira-cyan/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-geira-cyan animate-pulse" />
        </div>
      </div>
    </section>
  )
}
