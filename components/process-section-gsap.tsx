"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Search, Lightbulb, Code2, Rocket, CheckCircle2 } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      icon: Search,
      title: "Analyse",
      description: "Étude approfondie de vos besoins et objectifs pour définir la meilleure stratégie.",
      duration: "1-2 semaines",
      dataSpeed: 0.8,
    },
    {
      icon: Lightbulb,
      title: "Conception",
      description: "Élaboration de solutions créatives et techniques adaptées à votre projet.",
      duration: "2-3 semaines",
      dataSpeed: 1,
    },
    {
      icon: Code2,
      title: "Développement",
      description: "Réalisation technique avec méthodologie agile et tests continus.",
      duration: "4-8 semaines",
      dataSpeed: 1.2,
    },
    {
      icon: Rocket,
      title: "Déploiement",
      description: "Mise en production progressive avec formation et documentation complète.",
      duration: "1-2 semaines",
      dataSpeed: 1.4,
    },
    {
      icon: CheckCircle2,
      title: "Suivi",
      description: "Support continu, maintenance et optimisations pour garantir votre succès.",
      duration: "En continu",
      dataSpeed: 1.6,
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header parallax
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
        y: 100,
        opacity: 0,
      })

      // Each card with different speeds and mesmerizing effects
      const cards = timelineRef.current?.querySelectorAll(".process-card")
      cards?.forEach((card, index) => {
        const speed = steps[index].dataSpeed

        // Parallax movement based on data-speed
        gsap.to(card, {
          y: -100 * speed,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })

        // Entrance animation
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
          y: 150,
          opacity: 0,
          rotation: index % 2 === 0 ? -10 : 10,
          scale: 0.8,
        })

        // Rotation on scroll
        gsap.to(card, {
          rotation: index % 2 === 0 ? 2 : -2,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        })
      })

      // Connection line animation
      const line = timelineRef.current?.querySelector(".connection-line")
      if (line) {
        gsap.from(line, {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
          scaleX: 0,
          transformOrigin: "left center",
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="process" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-geira-cyan/50 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section Header */}
          <div ref={headerRef} className="text-center space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20">
              <span className="text-sm font-medium text-geira-cyan">Notre Méthodologie</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Un processus éprouvé pour
              <br />
              <span className="bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                des résultats garantis
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              De l'idée à la réalisation, nous vous accompagnons à chaque étape avec transparence et expertise.
            </p>
          </div>

          {/* Process Timeline */}
          <div ref={timelineRef} className="relative">
            {/* Connection Line */}
            <div className="connection-line hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-geira-cyan via-geira-accent to-geira-blue -translate-y-1/2" />

            <div className="grid md:grid-cols-5 gap-6 relative">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className="process-card p-6 bg-card/50 backdrop-blur-sm border-border hover:border-geira-cyan/50 transition-all duration-500 hover:shadow-2xl hover:shadow-geira-cyan/10 group relative"
                  data-speed={step.dataSpeed}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-geira-cyan to-geira-blue flex items-center justify-center text-sm font-bold shadow-lg shadow-geira-cyan/25">
                    {index + 1}
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-geira-cyan/20 to-geira-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-6 h-6 text-geira-cyan" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                      <div className="pt-2">
                        <span className="text-xs font-medium text-geira-cyan">{step.duration}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
