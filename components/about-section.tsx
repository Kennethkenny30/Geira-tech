"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Target, Zap, Users, Award } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      icon: Target,
      title: "Notre Mission",
      description:
        "Accompagner les entreprises dans leur transformation digitale et énergétique avec des solutions sur mesure.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Technologies de pointe et approches créatives pour des résultats exceptionnels.",
    },
    {
      icon: Users,
      title: "Expertise",
      description: "Une équipe passionnée et qualifiée à votre service pour concrétiser vos projets.",
    },
    {
      icon: Award,
      title: "Qualité",
      description: "Engagement envers l'excellence et la satisfaction client dans chaque projet.",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
          y: 100,
          opacity: 0,
          stagger: 0.2,
        })
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.children
        Array.from(cards).forEach((card, index) => {
          const direction = index % 2 === 0 ? -100 : 100
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
            x: direction,
            y: 50,
            opacity: 0,
            rotation: index % 2 === 0 ? -5 : 5,
          })
        })
      }

      if (statsRef.current) {
        gsap.from(statsRef.current, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
          y: 100,
          opacity: 0,
          scale: 0.9,
        })

        const statNumbers = statsRef.current.querySelectorAll(".stat-number")
        gsap.from(statNumbers, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 70%",
          },
          scale: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-geira-cyan/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div ref={headerRef} className="text-center space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20">
              <span className="text-sm font-medium text-geira-cyan">À propos de nous</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Votre partenaire technologique
              <br />
              <span className="bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                de confiance
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Geira Tech combine expertise technique, créativité et innovation pour offrir des solutions complètes qui
              propulsent votre entreprise vers l'avenir.
            </p>
          </div>

          {/* Features Grid */}
          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-geira-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-geira-cyan/10 group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-geira-cyan/20 to-geira-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-geira-cyan" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Key Numbers */}
          <div ref={statsRef}>
            <Card className="p-8 md:p-12 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="stat-number text-5xl font-bold bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                    3
                  </div>
                  <div className="text-lg font-medium">Domaines d'expertise</div>
                  <div className="text-sm text-muted-foreground">Digital, IT & Énergie</div>
                </div>
                <div className="space-y-2">
                  <div className="stat-number text-5xl font-bold bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                    10+
                  </div>
                  <div className="text-lg font-medium">Services proposés</div>
                  <div className="text-sm text-muted-foreground">Solutions complètes</div>
                </div>
                <div className="space-y-2">
                  <div className="stat-number text-5xl font-bold bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-lg font-medium">Satisfaction garantie</div>
                  <div className="text-sm text-muted-foreground">Engagement qualité</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
