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
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      icon: Search,
      title: "Analyse",
      description: "Étude approfondie de vos besoins et objectifs pour définir la meilleure stratégie.",
      duration: "1-2 semaines",
    },
    {
      icon: Lightbulb,
      title: "Conception",
      description: "Élaboration de solutions créatives et techniques adaptées à votre projet.",
      duration: "2-3 semaines",
    },
    {
      icon: Code2,
      title: "Développement",
      description: "Réalisation technique avec méthodologie agile et tests continus.",
      duration: "4-8 semaines",
    },
    {
      icon: Rocket,
      title: "Déploiement",
      description: "Mise en production progressive avec formation et documentation complète.",
      duration: "1-2 semaines",
    },
    {
      icon: CheckCircle2,
      title: "Suivi",
      description: "Support continu, maintenance et optimisations pour garantir votre succès.",
      duration: "En continu",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation du header
      if (headerRef.current) {
        const headerChildren = Array.from(headerRef.current.children)
        
        gsap.from(headerChildren, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
          y: 80,
          opacity: 0,
          stagger: 0.15,
          ease: "power2.out",
        })
      }

      // Animation des cards
      if (cardsContainerRef.current) {
        const cards = Array.from(cardsContainerRef.current.querySelectorAll(".process-card"))
        
        // S'assurer que les cards sont visibles initialement
        gsap.set(cards, { opacity: 1, visibility: "visible" })
        
        cards.forEach((card, index) => {
          const cardElement = card as HTMLElement
          
          // Animation d'entrée au scroll
          gsap.fromTo(cardElement, 
            {
              y: 80,
              opacity: 0,
              scale: 0.9,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardElement,
                start: "top 90%",
                end: "top 40%",
                toggleActions: "play none none reverse",
              },
            }
          )

          // Hover effects
          cardElement.addEventListener("mouseenter", () => {
            gsap.to(cardElement, {
              y: -8,
              scale: 1.03,
              duration: 0.3,
              ease: "power2.out",
            })
          })

          cardElement.addEventListener("mouseleave", () => {
            gsap.to(cardElement, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            })
          })
        })

        // Animation de la ligne de connexion
        const line = cardsContainerRef.current.querySelector(".connection-line")
        if (line) {
          gsap.fromTo(line,
            {
              scaleX: 0,
            },
            {
              scaleX: 1,
              transformOrigin: "left center",
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 70%",
                end: "bottom 40%",
                scrub: 1.5,
              },
            }
          )
        }

        // Animation des numéros
        const stepNumbers = Array.from(cardsContainerRef.current.querySelectorAll(".step-number"))
        stepNumbers.forEach((num) => {
          gsap.fromTo(num,
            {
              scale: 0,
              rotation: -180,
              opacity: 0,
            },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: num,
                start: "top 85%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
            }
          )
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="process" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-geira-cyan/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Section Header */}
          <div ref={headerRef} className="text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20 hover:border-geira-cyan/50 transition-all duration-300">
              <span className="text-sm font-medium text-geira-cyan">Notre Méthodologie</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Un processus éprouvé pour
              <br />
              <span className="bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                des résultats garantis
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              De l'idée à la réalisation, nous vous accompagnons à chaque étape avec transparence, expertise et
              innovation.
            </p>
          </div>

          {/* Process Cards */}
          <div ref={cardsContainerRef} className="relative">
            {/* Ligne de connexion */}
            <div className="connection-line hidden lg:block absolute top-[4.5rem] left-0 right-0 h-0.5 bg-gradient-to-r from-geira-cyan via-geira-accent to-geira-blue z-0 opacity-50" />

            {/* Grid des cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className="process-card p-6 bg-card/70 backdrop-blur-md border border-geira-cyan/20 
                             hover:border-geira-cyan/60 transition-all duration-500 group relative
                             flex flex-col min-h-[320px] w-full shadow-lg shadow-geira-cyan/10"
                >
                  {/* Numéro de l'étape */}
                  <div className="step-number absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full 
                                  bg-gradient-to-r from-geira-cyan to-geira-blue flex items-center justify-center 
                                  text-base font-bold shadow-lg shadow-geira-cyan/40 z-20 text-black">
                    {index + 1}
                  </div>

                  <div className="space-y-4 pt-6 flex-1 flex flex-col">
                    {/* Icône */}
                    <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-geira-cyan/30 to-geira-blue/30 
                                    flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 
                                    transition-all duration-300 shadow-lg shadow-geira-cyan/10">
                      <step.icon className="w-8 h-8 text-geira-cyan" />
                    </div>

                    {/* Contenu */}
                    <div className="text-center space-y-3 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold group-hover:text-geira-cyan transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {step.description}
                      </p>

                      {/* Durée */}
                      <div className="pt-2">
                        <span className="text-xs font-medium text-geira-cyan px-3 py-1.5 rounded-full 
                                       bg-geira-cyan/10 border border-geira-cyan/20 inline-block">
                          {step.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overlay gradient au hover */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-geira-cyan/0 to-geira-blue/0 
                                  group-hover:from-geira-cyan/5 group-hover:to-geira-blue/5 transition-all duration-500 
                                  pointer-events-none" />
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-12">
            <p className="text-lg text-muted-foreground mb-6">Prêt à transformer votre vision en réalité ?</p>
            <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-geira-cyan to-geira-blue text-black 
                               font-semibold hover:shadow-2xl hover:shadow-geira-cyan/40 hover:scale-105 
                               transition-all duration-300 shadow-lg shadow-geira-cyan/25 group">
              Discutons de votre projet
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}