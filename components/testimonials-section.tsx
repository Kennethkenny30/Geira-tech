"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "CEO, TechStart",
      company: "TechStart",
      avatar: "/professional-woman-diverse.png",
      rating: 5,
      text: "Geira Tech a transformé notre vision en réalité. Leur expertise technique et leur créativité ont dépassé toutes nos attentes. Un partenaire de confiance !",
    },
    {
      name: "Jean Martin",
      role: "Directeur IT, IndusCorp",
      company: "IndusCorp",
      avatar: "/professional-man.jpg",
      rating: 5,
      text: "L'automatisation mise en place a révolutionné nos processus. ROI exceptionnel et équipe toujours disponible. Je recommande vivement !",
    },
    {
      name: "Sophie Laurent",
      role: "Fondatrice, EcoSolutions",
      company: "EcoSolutions",
      avatar: "/professional-woman-smiling.png",
      rating: 5,
      text: "Installation solaire impeccable et suivi irréprochable. Geira Tech allie professionnalisme et innovation. Nos économies d'énergie parlent d'elles-mêmes.",
    },
    {
      name: "Thomas Bernard",
      role: "CMO, Fashion Boutique",
      company: "Fashion Boutique",
      avatar: "/professional-man-glasses.jpg",
      rating: 5,
      text: "Notre nouveau site e-commerce a multiplié nos ventes par 3. Design moderne, performance optimale et accompagnement personnalisé. Merci Geira Tech !",
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
          y: 80,
          opacity: 0,
          stagger: 0.2,
        })
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.children
        Array.from(cards).forEach((card, index) => {
          const isEven = index % 2 === 0
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
            x: isEven ? -150 : 150,
            y: 50,
            opacity: 0,
            rotation: isEven ? -10 : 10,
          })
        })
      }

      if (statsRef.current) {
        gsap.from(statsRef.current, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        })

        const statNumbers = statsRef.current.querySelectorAll(".stat-value")
        gsap.from(statNumbers, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 70%",
          },
          scale: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(2)",
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="relative py-32 overflow-hidden bg-card/20">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-geira-blue/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section Header */}
          <div ref={headerRef} className="text-center space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-geira-cyan/10 border border-geira-cyan/20">
              <span className="text-sm font-medium text-geira-cyan">Témoignages</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Ce que disent
              <br />
              <span className="bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                nos clients
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              La satisfaction de nos clients est notre plus grande fierté.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div ref={cardsRef} className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-geira-cyan/50 transition-all duration-500 hover:shadow-2xl hover:shadow-geira-cyan/10 group"
              >
                <div className="space-y-6">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-geira-cyan text-geira-cyan" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-lg leading-relaxed">{testimonial.text}</p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <Avatar className="w-12 h-12 border-2 border-geira-cyan/20">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-to-br from-geira-cyan/20 to-geira-blue/20">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div ref={statsRef}>
            <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                  <div className="stat-value text-4xl font-bold bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                    4.9/5
                  </div>
                  <div className="text-sm text-muted-foreground">Note moyenne</div>
                </div>
                <div className="space-y-2">
                  <div className="stat-value text-4xl font-bold bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                    150+
                  </div>
                  <div className="text-sm text-muted-foreground">Clients satisfaits</div>
                </div>
                <div className="space-y-2">
                  <div className="stat-value text-4xl font-bold bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                    98%
                  </div>
                  <div className="text-sm text-muted-foreground">Taux de recommandation</div>
                </div>
                <div className="space-y-2">
                  <div className="stat-value text-4xl font-bold bg-gradient-to-r from-geira-cyan to-geira-blue bg-clip-text text-transparent">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">Support disponible</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
